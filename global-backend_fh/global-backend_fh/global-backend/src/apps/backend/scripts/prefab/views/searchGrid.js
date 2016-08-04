define(function(require, exports, module) {

  var FilterHelper = require('skeleton/misc/filterHelper');
  var AutoQuerySwitch =  require('com/autoQuerySwitch/index');

  Base.Prefab.SearchGrid = Base.PrefabView.extend({

    searchGridTpl: _(require('text!prefab/templates/searchGrid.html')).template(),

    options: {
      prevClass: 'js-pf',
      checkable: false,
      //针对排序是否要到服务器获取数据
      dataProp: 'root',
      breadUseSearch: true,
      breadResetSearch: true,
      remoteEveryTime: true,
      sameNameFormat: false
    },

    constructor: function() {
      Base.PrefabView.prototype.constructor.apply(this, arguments);

      this._currentUrl = this.options.ajaxOps.url;
      this._breadList = [];
    },

    __events: function() {
      var events = {};

      events['submit .js-pf-search-form'] = 'searchHandler';
      events['click .js-pf-export'] = 'exportHandler';
      events['click .js-pf-search-bread'] = 'subBreadHandler';
      events['click .js-pf-sub'] = 'subBreadHandler';

      return events;
    },

    render: function() {
      this.triggerMethod('before:render', this);

      this.filterHelper = FilterHelper({},{sameNameFormat:this.options.sameNameFormat});

      this.$el.html(this.searchGridTpl({
        template: _(this.template).template()(this.options)
      }));

      this.triggerMethod('render', this);
    },

    onRender: function() {
      this.$searchForm = this.$('.js-pf-search-form');

      this.$breadcrumb = this.$('.js-pf-breadcrumb');

      this.$grid = this.$('.js-pf-search-grid');

      this.filterHelper.setForm(this.$searchForm);

      this._setUrlParams();

      this._initGrid(this.$grid);

      var clpValidate = this.$searchForm.parsley().validate();

      if(clpValidate){
        this.$searchForm.trigger('submit');
      }
    },

    _setUrlParams: function() {
      var params = _.getUrlParam();
      _(params).each(function(val, prop) {
        var $searchItem = this.$searchForm.find('[name=' + prop + ']');
        if ($searchItem.is('checkbox,radio')) {
          //todo 需要时再处理
        } else {
          $searchItem.val(val);
        }
      }, this);
    },

    _initGrid: function($grid) {
      var self = this;
      $grid.grid({
        checkable: this.options.checkable,
        columnDefinitions: this.options.columns,
        emptyTip: this.options.gridOps && this.options.gridOps.emptyTip,
        tableClass: this.options.tableClass,
        pagination: this.options.pagination,
        onPaginationChange: function(index) {
          self.filterHelper.set('pageIndex', index);
          self._getGridXhr({
            type: 'pagination'
          });
        },
        onSort: function(e, dir) {

          self.filterHelper.set({
            sortFlag: $(e.currentTarget).closest('th').data('id'),
            sortType: dir === 'desc' ? 1 : 2
          });

          self._getGridXhr({
            type: 'sort'
          });
        }
      });

      this.grid = $grid.grid('instance');

      return this;
    },

    _getGridXhr: function(options) {
      var self = this;
      var filters = this.filterHelper.get();
      
      var autoQuerySwitch = new AutoQuerySwitch();
      var msg = autoQuerySwitch.checkCanQuery(this.options.title,this.$searchForm);
      if(msg!==''){
        Global.ui.notification.show(msg);
        return ;
      }

      options = _(options || {}).defaults({
        type: 'research'
      });

      this.grid
        .clean()
        .showLoading();

      if (_(filters.pageIndex).isUndefined()) {
        filters.pageIndex = 0;
      }

      filters.pageIndex = Number(filters.pageIndex);

      if (filters.pageSize) {
        this.grid.setPageSize(filters.pageSize);
      }

      if (filters && filters.sortType) {
        _(this.options.columns).findWhere({
          id: filters.sortFlag
        }).sortable = {
          defaultDir: filters.sortType === 1 ? 'desc' : 'asc'
        };
      }

      this._currentUrl = options.url || this._currentUrl;

      if (options.type === 'research' || this.options.remoteEveryTime) {
        Global.sync.ajax({
          url: this._currentUrl,
          tradition: true,
          data: _(filters).extend(this.options.reqData)
        })
          .fail(function(def, type) {
            if (type !== 'abort') {
              self.grid.hideLoading();
            }
          })
          .done(function(res) {
            var list;
            if (res && res.result === 0) {
              if (!res[self.options.dataProp]) {
                res.root = [];
              }
              self._cache = {
                list: res[self.options.dataProp],
                res: res
              };

              if (!self.options.remoteEveryTime) {
                list = self._cache.list.slice(_(filters.pageIndex).mul(self.grid.option('pageSize')),
                  _(filters.pageIndex + 1).mul(self.grid.option('pageSize')));
              } else {
                list = self._cache.list;
              }

              self.renderGrid(list, res);
            } else {
              Global.ui.notification.show('数据异常。');
            }
          });
      } else if (!this.options.remoteEveryTime && options.type !== 'research') {
        //本地翻页
        self.renderGrid(this._cache.list.slice(_(filters.pageIndex).mul(self.grid.option('pageSize')),
          _(filters.pageIndex + 1).mul(self.grid.option('pageSize'))), self._cache.res);
      }

      return this;
    },

    renderBread: function() {
      var html = ['<li>您正在查看：</li>'];

      html.push('<li class="js-pf-search-bread" data-type="bread" data-url="' + this.options.ajaxOps.url + '">');
      html.push('<a href="javascript:void(0)">' + this.options.title + '</a> ');
      //html.push('<span class="divider">&gt;</span>');
      html.push('</li>');

      if (!this._breadList.length) {
        this.$breadcrumb.addClass('hidden');

      } else {
        //title: '下级管理',
        _(this._breadList).each(function(breadInfo, index) {

          if (index + 1 !== this._breadList.length) {
            html.push('<li class="js-pf-search-bread" data-type="bread"');
          } else {
            html.push('<li');
          }

          _.each(breadInfo.data, function(value, key) {
            html.push(' data-' + _(key).toDataStyle() + '="' + value + '"');
          });

          html.push('>');

          if (index + 1 !== this._breadList.length) {
            html.push('<a href="javascript:void(0)">' + breadInfo.label + '</a> ');

            //html.push('<span class="divider">&gt;</span>');
          } else {
            html.push(breadInfo.label);
          }

          html.push('</li>');
        }, this);

        this.$breadcrumb.html(html.join('')).removeClass('hidden');
      }
    },

    hasSub: function() {
      return !!this._breadList.length;
    },

    getCurtSub: function() {
      return _(this._breadList).last() || {};
    },

    //events handler

    searchHandler: function(e) {

      var filter = this.filterHelper.serializeObject({
        reset: true
      });

      this._breadList = [];

      this.renderBread();

      //if (filter.pageSize) {
      //  this.grid.option('pageSize', filter.pageSize);
      //}

      this.grid.sortReset();

      this._getGridXhr({
        url: this.options.ajaxOps.url
      });

      return false;
    },

    exportHandler: function() {
      var filters = this.filterHelper.serializeObject({
        reset: true
      });
      var $form = $('<form action="' + this.options.exportOps.url + '" method="get" target="_blank">');

      filters.token = Global.memoryCache.get('acctInfo').token;
      _(filters).each(function(val, name) {
        $form.append('<input type="hidden" name="' + name + '" value="' + val + '" />');
      });
      $form.submit();
      $form.remove();
    },

    subBreadHandler: function(e) {
      var $target = $(e.currentTarget);
      var url = $target.data('url') || this.options.subOps.url;

      var type = $target.data('type');

      var name = $target.data('label');

      //删除并添加隐藏input
      var req = {};

      if (type === 'bread') {
        this._breadList.splice($target.index() - 1);
      }

      this.$searchForm.find('.js-pf-hidden-bread').remove();

      _(this.options.subOps.data || []).each(function(prop) {
        var val = $target.data(prop);
        if (!_(val).isUndefined()) {
          req[prop] = val;
        }
      });

      //var input = _(this.options.subOps.data || []).reduce(function(inputs, prop) {
      //  var val = $target.data(prop);
      //
      //  self.filterHelper.unset(prop);
      //
      //  if (!_(val).isUndefined()) {
      //    req[prop] = val;
      //
      //    inputs.push('<input class="js-pf-hidden-bread" type="hidden" name="' + prop + '" value="' + $target.data(prop) + '" />');
      //  }
      //
      //  return input;
      //}, [], this);

      if (!_(req).isEmpty()) {
        //this.$searchForm.append(input.join(''));

        if (type !== 'bread') {
          this._breadList.push({
            label: name,
            data: req
          });
        }
      }

      //if (this.options.breadResetSearch) {
      //  this.$searchForm.find('[type=reset]').click();
      //}

      if (this.options.breadUseSearch) {
        this.filterHelper.serializeObject({
          reset: true
        });
      } else {
        this.filterHelper.set();
      }

      if (!$target.data('notAutoRender')) {
        this.renderBread();
      }

      this.filterHelper.set(req, {
        cleanPage: true
      });

      this.grid.sortReset();

      this._getGridXhr({
        url: url
      });
    }
  });
});