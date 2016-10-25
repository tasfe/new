"use strict";
require('./index.scss');

var FilterHelper = require('skeleton/misc/filterHelper');

var SearchGrid = Base.PrefabView.extend({

  searchGridTpl: _(require('./index.html')).template(),

  options: {
    prevClass: 'js-pf',
    tableClass: 'table table-bordered table-no-lr table-center',
    checkable: false,
    dataProp: 'root',
    listProp: 'root',
    footerClass: 'p-top-sm',
    remoteEveryTime: true,
    divider: true,
    tip: '',
    headTip: ''
  },

  initSearch: false,

  constructor: function() {
    Base.PrefabView.prototype.constructor.apply(this, arguments);

    this._currentUrl = this.options.ajaxOps.url;
    this._breadList = [];
  },

  __events: function() {
    var events = {};

    events['submit .js-pf-search-form'] = 'searchHandler';
    events['click .js-pf-search-bread'] = 'subBreadHandler';
    events['click .js-pf-sub'] = 'subBreadHandler';

    return events;
  },

  render: function() {
    this.triggerMethod('before:render', this);

    this.filterHelper = new FilterHelper();

    this.$el.html(this.searchGridTpl({
      template: _(this.template).template()(this.options),
      options: this.options
    }));

    this.$searchForm = this.$('.js-pf-search-form');

    this.$breadcrumb = this.$('.js-pf-breadcrumb');

    this.$grid = this.$('.js-pf-search-grid');

    this.filterHelper.setForm(this.$searchForm);

    this._setUrlParams();

    this._initGrid(this.$grid);

    this.triggerMethod('render', this);
  },

  onRender: function() {
    if (!this.initSearch) {
      this.$searchForm.trigger('submit');
    }
  },

  refresh: function() {
    this._getGridXhr();
  },

  _setUrlParams: function() {
    var params = _.getUrlParam();
    _(params).each(function(val, prop) {
      var $searchItem = this.$searchForm.find('[name=' + prop + ']');
      if (!$searchItem.is('checkbox,radio')) {
        //todo 需要时再处理
        $searchItem.val(val);
      }
    }, this);
  },

  _initGrid: function($grid) {
    var self = this;
    $grid.grid(_(this.options).chain().pick(
      'tableClass',
      'footerClass',
      'height',
      'tip'
    ).extend({
      checkable: this.options.checkable,
      columnDefinitions: this.options.columns,
      emptyTip: this.options.gridOps && this.options.gridOps.emptyTip,
      defaultEmptyTip: this.options.gridOps && this.options.gridOps.defaultEmptyTip,
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
    }).value());

    this.grid = $grid.grid('instance');
    
    return this;
  },

  _getGridXhr: function(options) {
    var self = this;
    var filters = this.filterHelper.get();

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
    } else {
      filters.pageSize = this.grid.option('pageSize')
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
        data: _(this.options.reqData||{}).extend(filters)
      })
        .fail(function(def, type) {
          if (type !== 'abort') {
            self.grid.hideLoading();
          }
        })
        .done(function(res) {
          var list;
          var data;

          if (res && res.result === 0) {
            data = _(self.options.dataProp.split('.')).reduce(function(res, prop) {
              return res[prop];
            }, res);

            list = _(self.options.listProp.split('.')).reduce(function(res, prop) {
              return res[prop];
            }, res);

            if (!data) {
              res.root = [];
            }

            self._cache = {
              list: list,
              data: data,
              res: res
            };

            if (!self.options.remoteEveryTime) {
              list = self._cache.list.slice(_(filters.pageIndex).mul(self.grid.option('pageSize')),
                _(filters.pageIndex + 1).mul(self.grid.option('pageSize')));
            } else {
              list = self._cache.list;
            }

            if (_.isEmpty(list)) {
              self.grid.renderEmpty();
            } else {
              self.grid.hideEmpty();
            }

            self.renderGrid(data, list, res);
          } else {
            Global.ui.notification.show(res.msg);
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
    html.push('<a class="btn-link btn-link-cool" href="javascript:void(0)">' + this.options.title + '</a> ');
    html.push('<span class="divider">&gt;</span>');
    html.push('</li>');

    if (!this._breadList.length) {
      this.$breadcrumb.addClass('hidden');

      this.grid.height(this.options.height);

    } else {
      this.grid.height(this.options.height - 41);

      _(this._breadList).each(function(breadInfo, index) {

        if (index + 1 !== this._breadList.length) {
          html.push('<li class="js-pf-search-bread" data-type="bread"');
        } else {
          html.push('<li class="active"');
        }

        _.each(breadInfo.data, function(value, key) {
          html.push(' data-' + _(key).toDataStyle() + '="' + value + '"');
        });

        html.push('>');

        if (index + 1 !== this._breadList.length) {
          html.push('<a href="javascript:void(0)" class="btn-link btn-link-cool">' + breadInfo.label + '</a> ');

          html.push('<span class="divider">&gt;</span>');
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

  isSub: function() {
    return !!this._breadList.length;
  },

  getCurtSub: function() {
    return _(this._breadList).last() || {};
  },

  search: function() {
    this.initSearch = true;
    var filter = this.filterHelper.serializeObject({
      reset: true
    });

    this._breadList = [];

    this.renderBread();

    this.grid.sortReset();

    this._getGridXhr({
      url: this.options.ajaxOps.url
    });
  },

  //events handler

  searchHandler: function(e) {
    this.search();

    return false;
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
      } else {
        req[prop] = null;
      }
    });

    if (!_(req).isEmpty()) {

      if (type !== 'bread') {
        this._breadList.push({
          label: name,
          data: req
        });
      }
    }

    //this.$searchForm.find('[type=reset]').click();
    this.filterHelper.serializeObject({
      reset: true
    });

    this.renderBread();

    this.filterHelper.set(req, {
      cleanPage: true
    });

    this.grid.sortReset();

    this._getGridXhr({
        url: url
      });
  }
});

module.exports = SearchGrid;
