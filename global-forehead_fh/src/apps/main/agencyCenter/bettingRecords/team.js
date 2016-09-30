"use strict";

var SearchGrid = require('com/searchGrid');

var TicketSelectGroup = require('com/ticketSelectGroup');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./index.html'),
  
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
      this.$('.js-pf-start-time').val( _(moment().add('days',-1)).toDate() );
    }else if (recIndex===3){
      this.$('.js-pf-start-time').val( _(moment().add('days')).toDate().slice(0,8) + '15' );
    }else if (recIndex===4) {
      this.$('.js-pf-start-time').val( _(moment().add('days')).toDate().slice(0,8) + '01' );
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

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
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
        emptyTip: '没有投注记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false
      },
      // viewType: 'team',
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
    
    //初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group')
    });

    //
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
        '<div class="text-hot">所有页总计</div>', '', '','',
        '<div class="text-hot">' + _(gridData.betMoneyTotal).fixedConvert2yuan() + '</div>',
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        ''
      ]
    }).hideLoading();
  },

  formatRowData: function(rowInfo) {

    var row = [];
    row.push(rowInfo.userName);
    row.push('<a class="router btn-link btn-link-sun" href="' + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + '">'+rowInfo.ticketTradeNo+'</a>');
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
    row.push(_(rowInfo.betTime).toTime());
    return row;
  }

});

module.exports = BettingRecordsView;
