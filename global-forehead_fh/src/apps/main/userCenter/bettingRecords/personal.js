"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '彩种名称',
          width: '10%'
        },
        {
          name: '投注奖期',
          width: '12%'
        },
        {
          name: '投注金额',
          width: '11%'
        },
        {
          name: '订单状态',
          width: '12%'
        },
        {
          name: '是否追号',
          width: '8%'
        },
        {
          name: '投注时间',
          width: '15%'
        },
        {
          name: '操作',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有投注记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.betList',
      tip: '<div class="m-left-md"><span>注意:</span> 投注记录只保留最近30天。</div>',
      height: 310
    });

    Global.memoryCache.set('ticketCachedList', []);
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();

    //初始化彩种选择
    //new TicketSelectGroup({
    //  el: this.$('.js-uc-ticket-select-group')
    //});

    this.$('select[name=betStatus]').html(_(betStatusConfig.get()).map(function(betStatus) {
      return '<option value="' + betStatus.id + '">' + betStatus.zhName + '</option>';
    }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    Global.memoryCache.set('ticketCachedList', _(gridData.betList).pluck('ticketTradeNo'));
    var rowsData = _(gridData.betList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行

    this.grid.addFooterRows({
      //trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">所有页总计</div>', '',
        '<div class="text-hot">' + _(gridData.betMoneyTotal).fixedConvert2yuan() + '</div>',
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        '', '', ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.ticketName);
    if(rowInfo.ticketPlanId==='mmc'){
      row.push('/');
    }else{
      row.push(rowInfo.ticketPlanId);
    }

    if(rowInfo.betTotalMoney==0) {
      row.push('免费游戏');
    }else {
      row.push(_(rowInfo.betTotalMoney).fixedConvert2yuan());
    }
    //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
    var status = _.checkBettingStatus({
      betStatus: rowInfo.ticketBetStatus,
      hasException: rowInfo.hasException,
      openNumbers: rowInfo.ticketResult,
      openStatus: rowInfo.ticketOpenStatus,
      prizing: rowInfo.prizing,
      prizeTotalMoney: rowInfo.prizeTotalMoney,
      betTime: rowInfo.betTime,
      prizeClass: 'text-bold-hot',
      ticketPlanId: rowInfo.ticketPlanId
    });

    row.push(status);
    row.push(rowInfo.chaseId ? '是' : '否');
    row.push(_(rowInfo.betTime).toTime());
    row.push('<a class="router btn-link btn-link-sun" href="' + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + '">查看详情</a>');

    return row;
  }
});

module.exports = BettingRecordsView;
