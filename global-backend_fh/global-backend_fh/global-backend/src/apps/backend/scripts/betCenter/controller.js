define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var TicketListView = require('betCenter/views/species-TicketList');

  var TicketBonusSetView = require('betCenter/views/species-TicketList-bonusSet');

  var TicketBetLimitView = require('betCenter/views/species-TicketList-betLimit');

  var TicketPlayDetailView = require('betCenter/views/species-TicketList-playDetail');

  var TicketPlayStatusView = require('betCenter/views/species-TicketList-playStatus');

  var TicketParamsSetView = require('betCenter/views/species-TicketList-paramsSet');

  var TicketMMCParamsSetView = require('betCenter/views/species-TicketList-mmcParamsSet');

  var TicketMMCInjectBonusListSetView =  require('betCenter/views/species-TicketList-injectBonusList');

  var TicketMMCSpecifyUserView = require('betCenter/views/species-TicketList-mmcSpecifyUser');

  var TicketPlanRuleSetView = require('betCenter/views/species-TicketList-planRuleSet');

  var LotteryMonitorView = require('betCenter/views/species-LotteryMonitor');

  var LotteryMonitorDetailView = require('betCenter/views/species-LotteryMonitor-lotteryDetail');

  var LotteryInterfaceView = require('betCenter/views/species-LotteryInterface');

  var BettingRecordView = require('betCenter/views/ticket-BettingRecord');

  var BettingRecordDetailView = require('betCenter/views/ticket-BettingRecord-detail');

  var ChaseRecordView = require('betCenter/views/ticket-ChaseRecord');

  var ChaseRecordDetailView = require('betCenter/views/ticket-ChaseRecord-detail');

  var AbnormalBettingCheckView = require('betCenter/views/ticket-AbnormalBettingCheck');

  var AbnormalBettingManageView = require('betCenter/views/ticket-AbnormalBettingManage');

  var RiskListView = require('betCenter/riskControl/riskList');
  var RiskDetailView = require('betCenter/riskControl/riskDetail');

  var BetHouseKeeperView = require('betCenter/views/bet-houseKeeper');

  var BetCenterController = RouterController.extend({

    ticketList: function() {
      this.changeMainReginView(new TicketListView());
    },

    bonusSet:function(ticketId){
      this.changeSubReginView(new TicketBonusSetView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    betLimit:function(ticketId){
      this.changeSubReginView(new TicketBetLimitView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    playDetail:function(ticketId){
      this.changeSubReginView(new TicketPlayDetailView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    playStatus:function(ticketId){
      this.changeSubReginView(new TicketPlayStatusView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    riskList: function(ticketId) {
      this.changeSubReginView(new RiskListView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    riskDetail: function(ticketId, ticketPlanId) {
      this.changeSubReginView(new RiskDetailView({
        ticketId: ticketId,
        ticketPlanId: ticketPlanId
      }), {
        parentRouter: 'bc/tl/riskList/' + ticketId
      });
    },

    paramsSet:function(ticketId){
      this.changeSubReginView(new TicketParamsSetView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    mmcParamsSet:function(ticketId){
      this.changeSubReginView(new TicketMMCParamsSetView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    injectBonusList:function(ticketId){
      this.changeSubReginView(new TicketMMCInjectBonusListSetView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl/mmcParams/' + ticketId
      });
    },

    specifyUser:function(ticketId){
      this.changeSubReginView(new TicketMMCSpecifyUserView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl/mmcParams/' + ticketId
      });
    },

    planRuleSet:function(ticketId){
      this.changeSubReginView(new TicketPlanRuleSetView({
        ticketId: ticketId
      }), {
        parentRouter: 'bc/tl'
      });
    },

    lotteryMonitor: function() {
      this.changeMainReginView(new LotteryMonitorView());
    },

    lotteryDetail:function(ticketResultId){
      this.changeSubReginView(new LotteryMonitorDetailView({
        ticketResultId: ticketResultId
      }), {
        parentRouter: 'bc/lm'
      });
    },

    lotteryInterface: function() {
      this.changeMainReginView(new LotteryInterfaceView());
    },

    bettingRecord: function() {
      this.changeMainReginView(new BettingRecordView());
    },

    bettingRecordDetail:function(ticketTradeNo){
      this.changeSubReginView(new BettingRecordDetailView({
        ticketTradeNo: ticketTradeNo
      }), {
        parentRouter: 'bc/br'
      });
    },

    chaseRecord: function() {
      this.changeMainReginView(new ChaseRecordView());
    },

    chaseRecordDetail:function(tradeNo){
      this.changeSubReginView(new ChaseRecordDetailView({
        tradeNo: tradeNo
      }), {
        parentRouter: 'bc/cr'
      });
    },

    abnormalBettingCheck: function() {
      this.changeMainReginView(new AbnormalBettingCheckView());
    },
    abnormalBettingManage: function() {
      this.changeMainReginView(new AbnormalBettingManageView());
    }
    ,
    betHouseKeeperView: function() {
      this.changeMainReginView(new BetHouseKeeperView());
    }


  });

  module.exports = BetCenterController;

});