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
          name: '账号',
          width: '12%'
        },
        {
          name: '结算周期',
          width: '12%'
        },
        {
          name: '累计销量 ',
          width: '15%'
        },
        {
          name: '盈亏累计',
          width: '15%'
        },
        {
          name: '分红比',
          width: '6%'
        },
        {
          name: '分红比',
          width: '12%'
        },
        {
          name: '状态',
          width: '12%'
        },
        {
          name: '操作',
          width: '12%'
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
      tip: '<div class="julien-btn-group-top"><button class="js-ac-multi-grant">提交分红申请</button></div>',
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
      '<div class="tips22">温馨提示：提示：下级分红每月1号和16号结算，只保留上一次的记录，未按时下发分红给下级平台会强制发放。</div>'
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
    var iIs = 0;
    if (rowsData != null && rowsData != '') {
      iIs = 1;
    }

    this.grid.addFooterRows4({
      trClass: 'julien-table-footer',
      columnEls: [
        '所有页总计',
        _(gridData.dividTotal).convert2yuan(),
      ],
      iIs: iIs
    })
    .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.username);
    row.push(rowInfo.cycle);
    row.push( _(rowInfo.betTotal).convert2yuan() );
    row.push( _(rowInfo.profitTotal).convert2yuan() );
    row.push(rowInfo.divid + '%');
    
    row.push( _(rowInfo.dividTotal).convert2yuan({fixed: 2, clear: false}) );

    row.push(grantConfig.getZh(rowInfo.status));

    var operate = [];

    if (rowInfo.status === grantConfig.getByName('WAIT').id) {
      operate.push('<button class="js-ac-grant btn btn-link btn-link-pleasant">发放</button>');
    }

    if (rowInfo.status === grantConfig.getByName('DONE').id) {
      operate.push('<a href="#fc/ad?tradeNo=' + rowInfo.tradeNo + '" class="btn btn-link btn-link-pleasant">查看明细</a>');
    }

    operate.push('<button class="js-ac-detail btn btn-link">明细</button>');
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
      size: 'modal-lg-julien',
      body: '<div class="js-ac-detail"></div>',
      footer: ''
    });

    var $detail = $dialog.find('.js-ac-detail');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });

    var dividendDetailView = new DividendDetailView({
      dividId: data.dividId,
      userId: data.userId,
      el: $detail
    }).render();
  }
});

module.exports = LowLevelView;
