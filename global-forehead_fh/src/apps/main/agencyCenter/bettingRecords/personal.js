"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./personal.html'),

  events: {
    'click .js-excess-cell': 'dateSelectHandler',
    'click .js-toggle-seach': 'toggleseachHandler'
  },
  dateSelectHandler:function (e) {
    var recIndex = $(e.currentTarget).data('index');
    this.$('.js-pf-end-time').val( _(moment().add('days')).toDate() );
    if (recIndex===1){
      this.$('.js-pf-start-time').val( _(moment().add('days')).toDate() );
    }else if (recIndex===2){
      this.$('.js-pf-start-time').val( _(moment().add('days',-3)).toDate() );
    }else if (recIndex===3){
      this.$('.js-pf-start-time').val( _(moment().add('days',-7)).toDate() );
    }
  },
  toggleseachHandler:function () {
    if($('.js-toggle-seach').hasClass('on')) {
      $('.search-condition-table .row2').addClass('hidden');
      $('.js-toggle-seach').removeClass('on')
    } else{
      $('.search-condition-table .row2').removeClass('hidden');
      $('.js-toggle-seach').addClass('on')
    }
  },
  initialize: function () {
    _(this.options).extend({
      columns: [
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
        subUser: 0
      },
      listProp: 'root.data',
      tip: '',
      height: 310
    });
    Global.memoryCache.set('agBetCachedList', []);
  },

  onRender: function() {
    this.$('.js-pf-search-grid').addClass('bc-report-table');

    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'regTimeStart',
      endTime: 'regTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      size: 'julien-time',
      prevClass: 'js-pf',
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
      }
    }).render();

    if(this.options.reqData.username){
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
        '<div class="text-hot">所有页总计</div>', '','', '',
        '<div class="text-hot">' + _(gridData.betTotalAmount).fixedConvert2yuan() + '</div>', '', ''
      ]
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
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
