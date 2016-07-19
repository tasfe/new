"use strict";

var FilterHelper = require('skeleton/misc/filterHelper');

var PlatformNewsLetterView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNews-letter.html'),

  events: {
    'click .js-nc-read': 'readHandler',
    'click .js-nc-del': 'deleteHandler'
  },

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          //name: '主题',
          width: '7%'
        },
        {
          //name: '收件人',
          width: '42%'
        },
        {
          //name: '时间',
          width: '17%'
        },
        {
          //name: '时间',
          width: '17%'
        },
        {
          //name: '发件人',
          width: '14%'
        }
      ],
      gridOps: {
        emptyTip: '没有消息'
      },
      height:380,
      tip: '<span class="m-right-sm"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      '<div class="btn-group"><button class="js-nc-read btn btn-hollow">标记为已读</button></div>' +
      '<div class="btn-group"><button class="js-nc-del btn btn-hollow">删除选中</button></div>',
      ajaxOps: {
        url: '/acct/usernotice/getletterlist.json'
      }
    });
  },

  onRender: function() {
    this.$grid = this.$('.js-nc-letter-grid');

    this.filterHelper = new FilterHelper();

    this.initGrid(this.$grid);

    this._getGridXhr();
  },

  initGrid: function($grid) {
    var self = this;
    $grid.grid({
      tableClass: 'table table-unbordered  no-margin' ,
      height:386,
      checkable: true,
      columnDefinitions: this.options.columns,
      tip: this.options.tip,
      emptyTip: this.options.gridOps.emptyTip,
      onPaginationChange: function(index) {
        self.filterHelper.set('pageIndex', index);
        self._getGridXhr();
      }
    });

    this.grid = $grid.grid('instance');

    return this;
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.letterList).map(function(info, index, list) {
      return {
        id: info.letterId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    if (gridData.letterList && gridData.letterList.length) {
      this.grid.hideEmpty();
    } else {
      this.grid.renderEmpty();
    }

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    })
      .hideLoading();
  },

  _getGridXhr: function() {
    var self = this;
    var filters = this.filterHelper.get();
    this.grid
      .clean()
      .showLoading();

    Global.sync.ajax({
      url: this.options.ajaxOps.url,
      data: _(filters).extend(this.options.reqData)
    })
      .fail(function(def, type) {
        if (type !== 'abort') {
          self.grid.hideLoading();
        }
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self.renderGrid(res.root, res);
          Global.m.news.updateUnReadNum({unReadLetter:res.root.unReadLetter});
        }
      });

    return this;
  },

  formatRowData: function(rowInfo) {
    var row = [];

    var textStyle = !rowInfo.isRead ? ' text-cool' : 'text-black';

    var prevA = '<a href="' + _.getUrl('/detail/' + rowInfo.titleId + '/' + rowInfo.letterId) + '" class="router btn-link ';
    prevA += textStyle + '">';

    var afterA = '</a>';

    row.push('<span class="sfa sfa-news-letter' + (!rowInfo.isRead ? '-active' : '') + '"></span>');

    row.push('<span class="' + textStyle + '">' + prevA + rowInfo.title + afterA + '</span>');

    row.push('<span class="vertical-middle sfa sfa-news-send' + (!rowInfo.isRead ? '-active' : '') + '"></span> ' +
      '<span class="' + textStyle + '">' + rowInfo.sender + '</span>'
    );

    row.push('<span class="vertical-middle sfa sfa-news-receive' + (!rowInfo.isRead ? '-active' : '') + '"></span> ' +
      '<span class="' + textStyle + '">' + rowInfo.recevier + '</span>'
    );

    row.push('<span class="' + textStyle + '">' + _(rowInfo.lastUpdate).toTime() + '</span>');

    return row;
  },

  //event handlers

  readHandler: function(e) {
    var self = this;
    var idList = this.grid.getChk().ids;

    if (_.isEmpty(idList)) {
      return false;
    }

    var model = Global.data.get('newsModel');
    var xhr = model.setReadLetterXhr(idList);

    if (xhr) {
      xhr
        .done(function() {
          self._getGridXhr();
        });
    }
  },

  deleteHandler: function(e) {
    var self = this;
    var idList = this.grid.getChk().ids;

    if (_.isEmpty(idList)) {
      return false;
    }

    var model = Global.data.get('newsModel');

    $(document).confirm({
      agreeCallback: function() {
        var xhr = model.deleteLetterXhr(idList);

        if (xhr) {
          xhr.done(function() {
            self._getGridXhr();
          });
        }
      }
    });
  }
});

module.exports = PlatformNewsLetterView;
