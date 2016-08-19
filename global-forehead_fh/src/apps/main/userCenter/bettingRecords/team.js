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
    this. $('.toggle-athena').removeClass('toggle-athena');
    $(e.currentTarget).addClass('toggle-athena');
    var recIndex = $(e.currentTarget).data('index');
    if (recIndex===1){
      this.$('.js-start-time').val(_(moment().add('days')).toDate()+' 0:00:00');
    }else if (recIndex===2){
      this.$('.js-start-time').val(_(moment().add('days',-3)).toDate()+' 0:00:00');
    }else if (recIndex===3){
      this.$('.js-start-time').val(_(moment().add('days',-7)).toDate()+' 0:00:00');
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
          width: '15%'
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
          width: '12%'
        },
        {
          name: '投注时间',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有投注记录'
      },
      tableClass:'bc-report-table table table-bordered table-no-lr table-center',
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false
      },
      // viewType: 'team',
      reqData: {
        subUser: 0
      },
      listProp: 'root.betList',
      tip: '<div class="m-left-md m-top-md text-hot"><span>注意:</span> 投注记录只保留最近30天。</div>',
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
        '<div class="text-hot">所有页总计</div>', '', '',
        '<div class="text-hot">' + _(gridData.betMoneyTotal).fixedConvert2yuan() + '</div>',
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        ''
      ]
    })
      .hideLoading();
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
