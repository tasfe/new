"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var BtnGroup = require('com/btnGroup');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./agBetting.html'),

  events: {},

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '15%'
        },
        {
          name: '订单编号',
          width: '15%'
        },
        {
          name: '游戏名称',
          width: '10%'
        },
        {
          name: '投注奖期',
          width: '12%'
        },
        {
          name: '投注时间',
          width: '15%'
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
          name: '盈亏金额',
          width: '8%'
        }
      ],
      gridOps: {
        emptyTip: '没有投注记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/agBetReport.json',
        abort: false
      },
      reqData: {
        subUser: 1
      },
      listProp: 'root.data',
      tip: '',
      height: 310
    });
    Global.memoryCache.set('agBetCachedList', []);
  },

  onRender: function() {
    var self = this;

    this.$btnGroup = this.$('.js-ac-btnGroup');

    this.$timeset = this.$('.js-ac-timeset');

    this.$('.js-pf-search-grid').addClass('bc-report-table');

    this.timeset = new Timeset({
      el: this.$timeset,
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      prevClass: 'js-pf'
    }).render();

    this.timeset.$startDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.timeset.$endDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      btnGroup: [
        {
          title: '今天',
          value: 0,
          active: true
        },
        {
          title: '三天',
          value: -3
        },
        {
          title: '七天',
          value: -7
        }
      ],
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        return false;
      }
    }).render();

    if(this.options.reqData.username) {
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    Global.memoryCache.set('agBetCachedList', _(gridData.data).pluck('billNo'));
    var rowsData = _(gridData.data).map(function(bet, index, root) {
      return {
        columnEls: this.formatRowData(bet, index, root),
        dataAttr: bet
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
        '所有页总计', '', '', '', '',
        '<div class="text-hot">' + _(gridData.betTotalAmount).fixedConvert2yuan() + '</div>', '', ''
      ]
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.playerName);
    row.push(rowInfo.billNo);
    row.push(rowInfo.gameName);
    row.push(rowInfo.gameCode);
    row.push(_(rowInfo.betTime).toTime());
    row.push(rowInfo.betAmount);
    row.push(rowInfo.settlmentStatus);
    row.push(rowInfo.profitLossMoney);
    return row;
  }
});

module.exports = BettingRecordsView;
