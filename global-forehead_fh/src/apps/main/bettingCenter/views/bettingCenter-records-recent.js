"use strict";

var ticketConfig = require('skeleton/misc/ticketConfig');

var BettingRecordsView = Base.ItemView.extend({

  template: '',

  events: {
    'click .js-bc-cancel-betting': 'cancelBettingHandler',
    'click .js-bc-betting-again': 'bettingAgainHandler'
  },

  height: 200,

  cancelBettingXhr: function(data){
    return Global.sync.ajax({
      url: '/ticket/bet/cancel.json',
      data: data
    });
  },

  bettingAgainXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/betagain.json',
      data: data
    });
  },

  onRender: function() {
     this.renderBettingRecords();
  },

  renderBettingRecords: function() {
    var self = this;
    if (!this.bettingRecords) {
     this.bettingRecords = this.$el.staticGrid({
       tableClass: 'table table-center',
       colModel: [
         {label: '<div class="text-center">期号</div>', name: 'ticketPlanId', width: '17%',formatter: function(val, index, bet) {
         var planId = val.replace(/.*-/, '');
           planId = planId.slice(-4);
           return '<a class="router btn-link" href="#gr/br/detail/' + bet.ticketTradeNo + '">' + planId + '</a>';
         }},
         {label: '<div class="text-center">投注金额</div>', name: 'betTotalMoney', width: '27%', formatter: function(val) {
           return _(val).fixedConvert2yuan({fixed: 2});
         }},
         {label: '<div class="text-center">状态</div>', name: 'prizeTotalMoney', width: '28%', formatter: function(val, index, bet) {
           //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
           return _.checkBettingStatus({
             betStatus: bet.ticketBetStatus,
             hasException: bet.hasException,
             openNumbers: bet.ticketResult,
             openStatus: bet.ticketOpenStatus,
             prizing: bet.prizing,
             prizeTotalMoney: bet.prizeTotalMoney,
             betTime: bet.betTime,
             prizeClass: 'text-pink',
             fixed: 2
           });
         }},
         {label: '<div class="text-center">操作</div>', name: 'betTotalMoney', width: '27%', formatter: function(val, index, bet) {
           var html = [];

           html.push('<button class="js-bc-betting-again btn btn-xxs" data-loading-text="再投">再投</button>');

           if (bet.canCancel) {
             html.push('<button class="js-bc-cancel-betting btn btn-xxs" data-loading-text="撤单">撤单</button>');
           }

           return html.join(' ');
         }}
       ],
       emptyTip: '无投注记录',
       url: '/ticket/bethistory/userbethistory.json',
       abort: false,
       // showHeader: false,
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

  //common APIs

  update: function() {
    this.renderBettingRecords();
  },

  confirmCancelBetting: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var betId = this.bettingRecords.getRowData($target).ticketBetId;
    $target.button('loading');

    this.cancelBettingXhr({
      betId: betId
    })
      .always(function(){
        $target.button('reset');
      })
      .done(function(res) {
        if(res.result === 0){
          Global.ui.notification.show("取消投注成功", {
            type: 'success'
          });
          self.update();
        } else {
          if(res.msg.indexOf('fail') !== -1){
            Global.ui.notification.show("取消投注失败!");
          }else{
            Global.ui.notification.show("取消投注失败：" + res.msg);
          }
          self.update();
        }
      });
  },

  confirmBettingAgain: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var betId = this.bettingRecords.getRowData($target).ticketBetId;
    $target.button('loading');

    this.bettingAgainXhr({
      ticketBetId: betId
    })
      .always(function(){
        $target.button('reset');
      })
      .done(function(res) {
        if(res.result === 0){
          Global.ui.notification.show("再次投注成功", {
            type: 'success'
          });
          self.update();
        } else {
          if(res.msg.indexOf('fail') !== -1){
            Global.ui.notification.show("再次投注失败!");
          }else{
            Global.ui.notification.show("再次投注失败：" + res.msg);
          }
          self.update();
        }
      });
  },

  //event handlers

  cancelBettingHandler: function(e){
    var self = this;
    var html = '<p>确定撤消订单？</p>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        self.confirmCancelBetting(e);
      }
    });
  },

  bettingAgainHandler: function(e) {
    var self = this;
    var html = '<p>确定再投一注吗？</p>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        self.confirmBettingAgain(e);
      }
    });
  }
});

module.exports = BettingRecordsView;
