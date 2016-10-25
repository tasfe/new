"use strict";

var SearchGrid = require('com/searchGrid');

var BtnGroup = require('com/btnGroup');

var Timeset = require('com/timeset');

var ReportManageView = SearchGrid.extend({

  template: require('./lottery.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      height: 330,
      title: '报表查询',
      columns: [
        {
          name: '日期',
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
          name: '日薪',
          width: '12%',
          sortable: true,
          id: 8
        },
        {
          name: '盈亏',
          width: '12%',
          sortable: true,
          id: 6
        }
        //{
        //  name: '操作',
        //  width: '9%'
        //}
      ],
      tip: '<div class="m-left-md">注意: 盈亏记录只保留最近35天数据。</div>',
      gridOps: {
        emptyTip: '没有盈亏记录'
      },
      ajaxOps: {
        url: '/fund/fundreport/amountreport.json'
      },
      subOps: {
        url: '/fund/fundreport/amountreport.json',
        data: ['userId']
      }
    });
    var acctInfo = Global.memoryCache.get('acctInfo');
    if(acctInfo.salaryStatus !=2 ){
      this.options.columns.splice(7,1);
    }
  },

  onRender: function () {
    //初始化时间选择
    var self = this;
    this.timeset = new Timeset({
      el: this.$('.js-ac-timeset'),
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

    this.$btnGroup = this.$('.js-ac-btnGroup');
    this.firstTime = true;
    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      btnGroup: [
        {
          title: '今日',
          value: 0,
          active: true
        },
        {
          title: '昨天',
          value: -1
        },
        {
          title: '本半月',
          value: -15
        },
        {
          title: '本月',
          value: -30
        }
      ],
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        self.search();
        return false;
      }
    }).render();
    this.firstTime = false;

    this.timeset.$startDate.on('dp.change', function() {
      if (self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.timeset.$endDate.on('dp.change', function() {
      if (self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });
    //new TicketSelectGroup({
    //  el: this.$('.js-ac-ticket-select')
    //});

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

    // if (!_(gridData.parents).isEmpty()) {
    //   this._breadList = _(gridData.parents).map(function(parent, index) {
    //     return {
    //       data: {
    //         userId: parent.userId
    //       },
    //       label: parent.userName
    //     };
    //   });
    //   this.renderBread();
    // }
    //
    var foot = {
      trClass: 'tr-footer',
      columnEls: [
        '总计',
        _(gridData.rechargeTotal).convert2yuan({fixed:2}),
        _(gridData.withdrawTotal).convert2yuan({fixed:2}),
        _(gridData.betTotal).fixedConvert2yuan(),
        _(gridData.prizeTotal).convert2yuan(),
        _(gridData.bonusTotal).convert2yuan(),
        _(gridData.activityTotal).convert2yuan(),
        _(gridData.salaryTotal).convert2yuan(),
        _(gridData.profitAndLossTotal).convert2yuan(),
      ]
    };
    var acctInfo = Global.memoryCache.get('acctInfo');
    if(acctInfo.salaryStatus !==2 ){
      foot.columnEls.splice(7,1);
    }
    this.grid.addFooterRows(foot)
      .hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
    /*if(this.hasSub() && rowInfo.userName === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.userName);
    } else {
      row.push('<a class="js-pf-sub btn-link btn-link-hot" data-label="' + rowInfo.userName +
        '" data-user-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
        rowInfo.userName + '</a>');
    }*/
    row.push(rowInfo.day);
    row.push(_(rowInfo.recharge).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.bet).convert2yuan({clear: false}));
    row.push(_(rowInfo.prize).convert2yuan({clear: false}));
    row.push(_(rowInfo.bonus).convert2yuan({clear: false}));
    row.push(_(rowInfo.activity).convert2yuan({clear: false}));

    var acctInfo = Global.memoryCache.get('acctInfo');
    if(acctInfo.salaryStatus ===2 ){
      row.push(_(rowInfo.salary).convert2yuan());
    }
    row.push(_(rowInfo.profitAndLoss).convert2yuan());
    //row.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">投注</a>&nbsp;&nbsp;' +
    // '<a  href="' + _.addHrefArgs('#ac/account/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">账变</a>');

    return row;
  }
});

module.exports = ReportManageView;
