"use strict";

var ticketConfig = require('skeleton/misc/ticketConfig');

var BettingRecordsView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-records.html'),

  events: {
    'click .js-bc-records-tab': 'toggleTabHandler'
  },

  height: 340,

  tableClass: 'table table-center',

  initialize: function() {
    this.options.type = 'draw';
  },

  onRender: function() {
    this.$bettingRecords = this.$('.js-bc-betting-records');
    this.$drawRecords = this.$('.js-bc-draw-records');

    this.renderDrawRecords();
  },

  renderBettingRecords: function() {
    var self = this;
    if (!this.bettingRecords) {
      this.bettingRecords = this.$bettingRecords.staticGrid({
        tableClass: this.tableClass,
        colModel: [
          {label: '期号', name: 'ticketPlanId', width: '40%',formatter: function(val, index, bet) {
              return '<a class="router btn-link" href="#uc/br/detail/' + bet.ticketTradeNo + '">' + val.substring(4) + '</a>';
          }},
          {label: '投注金额', name: 'betTotalMoney', width: '32%', formatter: function(val) {
            return _(val).fixedConvert2yuan();
          }},
          {label: '状态', name: 'prizeTotalMoney', width: '28%', formatter: function(val, index, bet) {
            //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
            return _.checkBettingStatus({
              betStatus: bet.ticketBetStatus,
              hasException: bet.hasException,
              openNumbers: bet.ticketResult,
              openStatus: bet.ticketOpenStatus,
              prizing: bet.prizing,
              prizeTotalMoney: bet.prizeTotalMoney,
              betTime: bet.betTime,
              prizeClass: 'text-pink'
            });
          }}
          //{label: '是否追号', name: 'chaseId', width: '10%', formatter: function(val) {
          //  return val ? '是' : '否';
          //}}
        ],
        emptyTip: '无投注记录',
        url: '/ticket/bethistory/userbethistory.json',
        abort: false,
        showHeader: false,
        height: this.height,
        data: {
          pageSize: 30,
          ticketId: this.options.ticketId
        },
        dataProp: 'root.betList'
      }).staticGrid('instance');
    } else {
      this.bettingRecords.update();
    }
  },

  renderDrawRecords: function() {
    //if (!this.drawRecords) {
    //  var gridTable = {};
    //  var sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id');
    //  var c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id');
    //  var dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id');
    //  if(_(sscTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //    gridTable = this._renderSSCLotteryRecord();
    //  }else if(_(c115TicketIdArr).indexOf(this.options.ticketId)!==-1){
    //    gridTable = this._render115LotteryRecord();
    //  }else if(_(dpcTicketIdArr).indexOf(this.options.ticketId)!==-1){
    //    gridTable = this._renderDPCLotteryRecord();
    //  }
    //  this.drawRecords = this.$drawRecords.staticGrid(gridTable).staticGrid('instance');
    //} else {
    //  this.drawRecords.update();
    //}
  },

  _renderSSCLotteryRecord: function () {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '', name: 'ticketPlanId', formatter: function(val, prop, info) {
          return val + '期 - ' + info.ticketOpenNum;
        }}
        //{label: '开奖号', name: 'ticketOpenNum', width: '24%'},
        //{label: '前三', name: 'qianSan', width: '17%'},
        //{label: '后三', name: 'houSan', width: '17%', formatter: function (val) {
        //  return val;
        //}}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      emptyTip: '最近无开奖记录',
      abort: false,
      initRemote: false,
      showHeader: false,
      height: this.height,
      data: {
        pageSize: 30,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },
  _render115LotteryRecord: function () {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', width: '50%'},
        {label: '开奖号', name: 'ticketOpenNum', width: '50%'}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      initRemote: false,
      showHeader: false,
      data: {
        pageSize: 84,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },
  _renderDPCLotteryRecord: function() {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', width: '40%', formatter: function(val) {
          return val.substring(4);
        }},
        {label: '开奖号', name: 'ticketOpenNum', width: '30%'},
        {label: '三星', name: 'qianSan', width: '20%'}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      showHeader: false,
      initRemote: false,
      data: {
        pageSize: 20,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },


  //common APIs
  update: function() {
    if (this.options.type === 'draw') {
      this.renderDrawRecords();
      this.$bettingRecords.addClass('hidden');
      this.$drawRecords.removeClass('hidden');


    } else {
      this.renderBettingRecords();
      this.$bettingRecords.removeClass('hidden');
      this.$drawRecords.addClass('hidden');

      //alert(this.$bettingRecords.html())
      this.$('.js-bc-lottery-preview').addClass('hidden');
      this.$('.js-bc-lottery-preview').hide;
    }
  },

  //event handlers

  toggleTabHandler: function(e) {

    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');

    this.options.type = $target.data('type');

    this.update();
  }
});

module.exports = BettingRecordsView;
