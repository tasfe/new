"use strict";

var SearchGrid = require('com/searchGrid');

var TicketSelectGroup = require('com/ticketSelectGroup');

var Timeset = require('com/timeset');

var BtnGroup = require('com/btnGroup');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./betting.html'),

  events: {},

  initialize: function() {
    _(this.options).extend({
      columns: [
        /*{
          name: '账号',
          width: '10%'
        },*/
        {
          name: '订单编号',
          width: '17%'
        },
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
          width: '11%'
        },
        {
          name: '投注时间',
          width: '14%'
        }
      ],
      gridOps: {
        emptyTip: '<dl><dt><span class="sfa sfa-grid-no-result"></span></dt><dd><p>没有投注记录</p><span>去试试最热门的 <a href="#bc/21" class="router">韩国1.5分彩</a> 吧！</span></dd></dl>'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.betList',
      tip: '',
      height: 310
    });
    Global.memoryCache.set('ticketCachedList', []);
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
      // startOps: {
      //   format: 'YYYY-MM-DD'
      // },
      // endOps: {
      //   format: 'YYYY-MM-DD'
      // }
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
        (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        return false;
      }
    }).render();

    if(this.options.reqData.username) {
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    //初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group')
    });

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
        '所有页总计', '', '',
        _(gridData.betMoneyTotal).fixedConvert2yuan(),
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        ''
      ]
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    /*row.push(rowInfo.userName);*/
    row.push('<a class="router btn-link" href="' + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + '">' + rowInfo.ticketTradeNo + '</a>');
    row.push(rowInfo.ticketName);
    if(rowInfo.ticketPlanId === 'mmc') {
      row.push('/');
    } else {
      row.push(rowInfo.ticketPlanId);
    }
    if(rowInfo.betTotalMoney == 0) {
      row.push('免费游戏');
    } else {
      row.push(_(rowInfo.betTotalMoney).fixedConvert2yuan());
    }

    var status = _.checkBettingStatus({
      betStatus: rowInfo.ticketBetStatus,
      hasException: rowInfo.hasException,
      openNumbers: rowInfo.ticketResult,
      openStatus: rowInfo.ticketOpenStatus,
      prizing: rowInfo.prizing,
      prizeTotalMoney: rowInfo.prizeTotalMoney,
      betTime: rowInfo.betTime,
      prizeClass: 'text-hot',
      ticketPlanId: rowInfo.ticketPlanId
    });

    row.push(status);
    row.push(_(rowInfo.betTime).toTime());
    return row;
  }

});

module.exports = BettingRecordsView;
