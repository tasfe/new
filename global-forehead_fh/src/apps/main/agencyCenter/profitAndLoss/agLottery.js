"use strict";

var SearchGrid = require('com/searchGrid');

var BtnGroup = require('com/btnGroup');

var Timeset = require('com/timeset');

var ReportManageView = SearchGrid.extend({

  template: require('./agLottery.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      height: 330,
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
        url: '/ticket/bethistory/agProfitLossReport.json'
      },
      subOps: {
        url: '/ticket/bethistory/agProfitLossReport.json',
        data: ['userId']
      }
    });
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
    var rowsData = _(gridData.dataList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.total.rowCount, {
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
    var foot = {
      trClass: 'tr-footer',
      columnEls: [
        '总计',
        _(gridData.total.recharge).convert2yuan({fixed:2}),
        _(gridData.total.withdraw).convert2yuan({fixed:2}),
        _(gridData.total.bet).fixedConvert2yuan(),
        _(gridData.total.prize).convert2yuan(),
        _(gridData.total.rebate).convert2yuan(),
        _(gridData.total.activity).convert2yuan(),
        _(gridData.total.profit).convert2yuan(),
      ]
    };

    this.grid.addFooterRows(foot)
      .hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
    if(this.hasSub() && rowInfo.userName === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.userName);
    } else {
      row.push('<a class="js-pf-sub btn-link btn-link-hot" data-label="' + rowInfo.userName +
        '" data-user-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
        rowInfo.userName + '</a>');
    }

    row.push(_(rowInfo.recharge).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false}));
    row.push(_(rowInfo.bet).convert2yuan({clear: false}));
    row.push(_(rowInfo.prize).convert2yuan({clear: false}));
    row.push(_(rowInfo.rebate).convert2yuan({clear: false}));
    row.push(_(rowInfo.activity).convert2yuan({clear: false}));

    row.push(_(rowInfo.profit).convert2yuan());

    return row;
  }
});

module.exports = ReportManageView;
