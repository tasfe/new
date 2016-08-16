"use strict";

var SearchGrid = require('com/searchGrid');

var grantConfig = require('./../grantConfig');

var DividendDetailView = require('./../dividendDetail');

var LowLevelView = SearchGrid.extend({

  template: require('./lowLevel.html'),

  events: {
    'click .js-ac-grant': 'grantHandler',
    'click .js-ac-multi-grant': 'multiGrantHandler',
    'click .js-ac-detail': 'detailHandler'
  },

  giveOutXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/give.json',
      data: data
    });
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '结算日期',
          width: '23%'
        },
        {
          name: '用户名',
          width: '18%'
        },
        {
          name: '分红金额',
          width: '18%'
        },
        {
          name: '状态',
          width: '18%'
        },
        {
          name: '操作',
          width: '18%'
        }
      ],
      gridOps: {
        emptyTip: '没有发放记录'
      },
      ajaxOps: {
        url: '/fund/divid/subdivid.json'
      },
      checkable: true,
      listProp: 'root.dividList',
      tip: '<span class="m-right-sm vertical-middle"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      '<div class="btn-group"><button class="js-ac-multi-grant btn btn-sm">发放</button></div>',
      height: 290
    });
  },

  serializeData: function() {
    return {
      grants: grantConfig
    };
  },

  onRender: function() {
    this.$('select[name=status]').append(_(grantConfig.getAll()).map(function(grant) {
      return '<option value="' + grant.id + '">' + grant.zhName + '</option>';
    }).join(''));

    this.$('.js-pf-breadcrumb').before(
      '<div class="alert">' +
      '<span class="text-bold-dark">温馨提示：</span>' +
      '提示：下级分红每月1号和16号结算，只保留上一次的记录，未按时下发分红给下级平台会强制发放。' +
      '</div>'
    );

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.dividList).map(function(info, index, list) {
      return {
        id: info.dividId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '', '',
        _(gridData.dividTotal).convert2yuan(),
        '', ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.cycle);
    row.push(rowInfo.username);
    row.push('<span class="text-bold-pleasant">' + _(rowInfo.dividTotal).convert2yuan({fixed: 2, clear: false}) + '</span>');

    row.push(grantConfig.getZh(rowInfo.status));

    var operate = [];

    if (rowInfo.status === grantConfig.getByName('WAIT').id) {
      operate.push('<button class="js-ac-grant btn btn-link btn-link-pleasant">发放</button>');
    }

    if (rowInfo.status === grantConfig.getByName('DONE').id) {
      operate.push('<a href="#fc/ad?tradeNo=' + rowInfo.tradeNo + '" class="btn btn-link btn-link-pleasant">查看</a>');
    }

    operate.push('<button class="js-ac-detail btn btn-link btn-link-cool">明细</button>');
    row.push(operate.join(''));

    return row;
  },

  _giveOut: function($target, data) {
    var self = this;

    $(document).confirm({
      title: '提示',
      content: '确定将分红发放至下级？',
      agreeCallback: function() {
        $target.button('loading');
        self.giveOutXhr(data)
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              self._getGridXhr();
            } else {
              Global.ui.notification.show(res.msg || '');
            }
          });
      }
    });
  },

  //event handlers

  grantHandler: function(e) {
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    this._giveOut($target, {
      dividId: data.dividId
    });
  },

  multiGrantHandler: function(e) {
    var $target = $(e.currentTarget);
    var ids = this.grid.getChk().ids;

    if (!ids) {
      return false;
    }

    this._giveOut($target, {
      dividId: ids.join(',')
    });
  },

  detailHandler: function(e) {
    var $target = $(e.currentTarget);
    var data = this.grid.getRowData($target);

    var $dialog = Global.ui.dialog.show({
      title: data.username + '的分红明细',
      size: 'modal-lg',
      body: '<div class="js-ac-detail"></div>',
      footer: ''
    });

    var $detail = $dialog.find('.js-ac-detail');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      dividendDetailView.destroy();
    });

    var dividendDetailView = new DividendDetailView({
      dividId: data.dividId,
      userId: data.userId,
      el: $detail
    }).render();
  }
});

module.exports = LowLevelView;
