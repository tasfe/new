"use strict";

var SearchGrid = require('com/searchGrid');

var TicketSelectGroup = require('com/ticketSelectGroup');

var Timeset = require('com/timeset');

var ReportManageView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      height: 375,
      title: '报表查询',
      columns: [
        {
          name: '用户名',
          width: '10%'
        },
        {
          name: '充值',
          width: '10%',
          sortable: true,
          id: 1
        },
        {
          name: '提现',
          width: '10%',
          sortable: true,
          id: 2
        },
        {
          name: '投注',
          width: '10%',
          sortable: true,
          id: 3
        },
        {
          name: '中奖',
          width: '10%',
          sortable: true,
          id: 4
        },
        {
          name: '返点',
          width: '10%',
          sortable: true,
          id: 5
        },
        {
          name: '活动',
          width: '9%',
          sortable: true,
          id: 7
        },
        {
          name: '盈亏',
          width: '12%',
          sortable: true,
          id: 6
        },
        {
          name: '操作',
          width: '9%'
        }
      ],
      //tip: '<div class="tip-hot"><span>提示</span>报表只保留最近35天的数据。</div>',
      gridOps: {
        emptyTip: '没有资金变更记录'
      },
      ajaxOps: {
        url: '/fund/fundreport/profitreport.json'
      },
      subOps: {
        url: '/fund/fundreport/profitdetail.json',
        data: ['userId']
      }
    });
  },

  onRender: function () {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-ac-timeSel'),
      startTime: 'startTime',
      endTime: 'endTime',
      startTimeHolder: '起始日期',
      startDefaultDate: _(moment()).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: _(moment()).toDate(),
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
      }
    }).render();

    new TicketSelectGroup({
      el: this.$('.js-ac-ticket-select')
    });

    //初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.amountList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false
    });

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map(function(parent, index) {
        return {
          data: {
            userId: parent.userId
          },
          label: parent.userName
        };
      });
      this.renderBread();
    }
    //
    //this.grid.addFooterRows({
    //  trClass: 'tr-footer',
    //  columnEls: [
    //    '<strong>总计</strong>',
    //    _(gridData.rechargeTotal).convert2yuan({fixed:2}),
    //    _(gridData.withdrawTotal).convert2yuan({fixed:2}),
    //    _(gridData.betTotal).fixedConvert2yuan(),
    //    _(gridData.prizeTotal).convert2yuan(),
    //    _(gridData.bonusTotal).convert2yuan(),
    //    _(gridData.activityTotal).convert2yuan(),
    //    _(gridData.profitAndLossTotal).convert2yuan(),
    //    ''
    //  ]
    //})
    //  .hideLoading();
    this.grid.hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
    if(this.hasSub() && rowInfo.userName === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.userName);
    } else {
      row.push('<a class="js-pf-sub btn-link" data-label="' + rowInfo.userName +
        '" data-user-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
        rowInfo.userName + '</a>');
    }

    row.push(_(rowInfo.recharge).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.bet).fixedConvert2yuan());
    row.push(_(rowInfo.prize).convert2yuan({clear: false}));
    row.push(_(rowInfo.bonus).convert2yuan({clear: false}));
    row.push(_(rowInfo.activity).convert2yuan({clear: false}));
    row.push(_(rowInfo.profitAndLoss).convert2yuan({clear: false}));
    row.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">投注</a>&nbsp;&nbsp;' +
      '<a  href="' + _.addHrefArgs('#ac/account/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">账变</a>');

    return row;
  }
});

module.exports = ReportManageView;
