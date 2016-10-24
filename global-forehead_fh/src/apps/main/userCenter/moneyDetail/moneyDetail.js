"use strict";

var tradingStatusConfig = require('../misc/tradingStatusConfig');

var SearchGrid = require('com/searchGrid');
var BtnGroup = require('com/btnGroup');
var Timeset = require('com/timeset');

var MoneyDetailView = SearchGrid.extend({

  template: require('./moneyDetail.html'),

  events: {},

  initialize: function() {
    _(this.options).defaults({
      betDetailPrevUrl: '#gr/br/detail/',
      chaseDetailPrevUrl: '#gr/tr/detail/'
    });

    _(this.options).extend({
      height: 330,
      columns: [
        {
         name: '交易流水号',
         width: '15%'
        },
        {
          name: '交易时间',
          width: '15%'
        },
        {
          name: '交易类型',
          width: '10%'
        },
        {
          name: '账变',
          width: '15%'
        },
        //{
        //  name: '支出',
        //  width: '14%'
        //},
        {
          name: '账户余额',
          width: '15%'
        },
        {
          name: '备注',
          width: '20%'
        }
      ],
      tip: '提示：账变明细只保留30天数据。',
      gridOps: {
        emptyTip: '没有账变明细'
      },
      ajaxOps: {
        url: '/fund/balance/history.json'
      },
      reqData: {
        subUser: 0
      }
    });
  },

  onRender: function() {
    var self = this;

    this.$btnGroup = this.$('.js-ac-btnGroup');
    this.$timeset = this.$('.js-ac-timeset');

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
        self.search();
        return false;
      }
    }).render();

    this.$('select[name=tradeType]').html(_(tradingStatusConfig.get()).map(function(status) {
      return '<option value="' + status.id + '">' + status.searchName + '</option>';
    }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.balanceList).map(function(bet, index, betList) {
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
        trClass: 'tr-cool',
        columnEls: [
          '<div class="text-hot">所有页总计</div>',
          '','','',
          '<div class="text-hot">' +  _(gridData.income + gridData.spending).convert2yuan() + '</div>',
          ''
        ]
      })
      .hideLoading();
  },

  formatRowData: function(info) {
    var row = [];

    if (info.remark === '投注扣款' || info.remark === '中奖' || info.remark.indexOf('投注所得') !== -1 || info.remark === '用户撤单' || info.remark === '系统撤单') {
      row.push('<a href="' + this.options.betDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-hot">' + info.tradeNo + '</a>');
    } else if (info.remark === '追号扣款' || info.remark.indexOf('撤销追号') !== -1) {//
      row.push('<a href="' + this.options.chaseDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-hot">' + info.tradeNo + '</a>');
    } else {
      row.push(info.tradeNo);
    }

    row.push(_(info.createTime).toTime());
    row.push(tradingStatusConfig.toZh(info.tradeType));

    if (info.amount >= 0) {
      row.push('<span class="">+'+_(info.amount).convert2yuan()+'</span>');
    } else {
      row.push('<span class="">'+_(info.amount).convert2yuan()+'</span>');
    }

    row.push('<span class="text-bold-cool">'+_(info.balance).convert2yuan()+'</span>');
    row.push(info.remark);
    return row;
  }
});

module.exports = MoneyDetailView;