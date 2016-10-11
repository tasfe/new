"use strict";

var RouterController = require('skeleton/controllers/router');

var LowLevelManageView = require('agencyCenter/views/lowLevelManage');
var LowLevelRebateView = require('agencyCenter/views/lowLevelManage-rebate');

var LowLevelBettingRecordsView = require('userCenter/bettingRecords');
var LowLevelBettingDetailView = require('agencyCenter/views/lowLevelManage-bettingDetail');

var LowLevelTrackRecordsView = require('userCenter/trackRecords');
var LowLevelTrackDetailView = require('agencyCenter/views/lowLevelManage-trackDetail');

var LowLevelAccountDetailView =require('agencyCenter/views/lowLevelManage-accountDetail');
var LowLevelSendMessageView =require('agencyCenter/views/lowLevelManage-sendMessage');
var LowLevelTransferView =require('agencyCenter/views/lowLevelManage-transfer');

var LowLevelDetailView = require('agencyCenter/views/lowLevelDetail');

var OpenAccountManageView = require('agencyCenter/openAccount');
var OpenAccountManagePriceView = require('agencyCenter/openAccount/price');

var TeamDynamicView = require('agencyCenter/views/teamDynamic');
var ReportManageView = require('agencyCenter/reportManage');

var ProfitAndLossView = require('agencyCenter/profitAndLoss');

var DividendMangeView = require('./dividendManage');
var RedPacketView = require('./redPacket');

var CommissionStatisticsView = require('./commissionStatistics');

//充值、提现、投注 记录
var RechargeRecordsView = require('userCenter/rechargeRecords');
var WithdrawRecordsView = require('userCenter/withdrawRecords');
//var ActiveRecordView = require('userCenter/activeRecords'); //活动数据详情页

var RushRewardView = require('./rushReward');

var SalaryView = require('agencyCenter/salaryManage');


var TeamGamesView = require('agencyCenter/teamGames');
var MoneyDetailsView = require('agencyCenter/moneyChange');

var AgencyCenterController = RouterController.extend({

  lowLevelManage: function() {
    this.changeMainReginView(new LowLevelManageView(), {
      main: {
        // title: '下级管理'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  accountDetails2: function() {
    this.changeMainReginView(new MoneyDetailsView(), {
      main: {
      	
//      title: '账户明细'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  teamGames: function() {
    this.changeMainReginView(new TeamGamesView(), {
      main: {
        // title: '团队游戏'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  salaryManage: function () {
    this.changeMainReginView(new SalaryView(), {
      main: {
        title: '日工资管理'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  rebateManage: function(userId){
    this.changeSubReginView(new LowLevelRebateView({
      userId: userId
    }), {
      main: {
        title: '编辑' + _.getUrlParam('name') + '的返点'
      },
      parentRouter: 'ac/llm'
    });
  },

  lowLevelDetail: function(userId) {
    this.changeSubReginView(new LowLevelDetailView({
      userId: userId
    }), {
      main: {
        title: '查看' + _.getUrlParam('name') + '的详情'
      },
      parentRouter: 'ac/llm'
    });
  },

  bettingRecords: function(userId , tabName) {
    var userName = _.getUrlParam('name');
    this.changeSubReginView(new LowLevelBettingRecordsView({
      triggerTab: tabName,
      reqData: {
        //userId: userId,
        username: userName
      }
    }), {
      main: {
        title: '查看' + userName + '的投注记录'
      },
      parentRouter: 'ac/llm'
    });
  },

  bettingDetail: function(userId, tabName,betId) {
    this.changeSubReginView(new LowLevelBettingDetailView({
      userId: userId,
      tradeNo: betId
    }), {
      main: {
        title: '查看' + _.getUrlParam('name') + '的投注详情'
      },
      parentRouter: 'ac/llm'
    });
  },

  trackRecords: function(userId, tabName) {
    var userName = _.getUrlParam('name');
    this.changeSubReginView(new LowLevelTrackRecordsView({
      triggerTab: tabName,
      reqData: {
        //userId: userId,
        username: userName
      }
    }), {
      main: {
        title: '查看' + userName + '的追号记录'
      },
      parentRouter: 'ac/llm'
    });
  },

  trackDetail: function(userId, tabName,tradeNo) {
    this.changeSubReginView(new LowLevelTrackDetailView({
      userId: userId,
      tradeNo: tradeNo
    }), {
      main: {
        title: '查看' + _.getUrlParam('name') + '的追号详情'
      },
      parentRouter: 'ac/llm'
    });
  },

  openAccountManage: function() {

    this.changeMainReginView(new OpenAccountManageView(), {
      main: {
        title: '开户管理'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  reportManage: function() {
    this.changeMainReginView(new ReportManageView(), {
      main: {
        title: '报表查询'
      },
      sidebar: 'ac'
    });
  },

  teamDynamic: function() {
    this.changeMainReginView(new TeamDynamicView(), {
      main: {
        // title: '团队动态'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  accountDetail : function(userId, tabName){
    var userName = _.getUrlParam('name');
    this.changeSubReginView(new LowLevelAccountDetailView({
      triggerTab: tabName,
      userId: userId,
      username: userName
    }), {
      main: {
        title: '查看' + userName + '的账变记录'
      },
      parentRouter: 'ac/llm'
    });
  },

  sendMessage : function(userId){
    this.changeSubReginView(new LowLevelSendMessageView({
      userId: userId
    }), {
      parentRouter: 'ac/llm'
    });
  },

  transfer : function(userId){
    this.changeSubReginView(new LowLevelTransferView({
      userId: userId
    }), {
      parentRouter: 'ac/llm'
    });
  },

  bettingRecords4Report: function(tabName) {
    var startTime = _.getUrlParam('startTime');
    var endTime = _.getUrlParam('endTime');
    var userName = _.getUrlParam('userName');
    this.changeSubReginView(new LowLevelBettingRecordsView({
      triggerTab: tabName,
      reqData: {
        username: userName,
        startTime: startTime,
        endTime: endTime
      }
    }), {
      main: {
        title: '查看' + userName + '的投注记录'
      },
      parentRouter: 'ac/rm'
    });
  },

  accountDetail4Report: function(userId) {
    this.changeSubReginView(new LowLevelAccountDetailView({
      userId: userId
    }), {
      main: {
        title: '查看' + _.getUrlParam('name') + '的账变记录'
      },
      parentRouter: 'ac/rm'
    });
  },
  openAccountManagePrice: function(ticket) {
    this.changeSubReginView(new OpenAccountManagePriceView({
      triggerTab: ticket,
      rebate: _.getUrlParam('rebate')
    }), {
      parentRouter: 'ac/oam'
    });
  },

  dividendManage: function() {
    this.changeMainReginView(new DividendMangeView(), {
      main: {
        title: '分红管理'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },

  redPacket: function() {
    this.changeMainReginView(new RedPacketView(), {
      main: {
        title: '红包查询'
      },
      sidebar: 'ac'
    });
  },
  commissionStatistics: function() {
    this.changeMainReginView(new CommissionStatisticsView(), {
      main: {
        title: '佣金管理'
      },
      sidebar: 'ac',
      topView: 'team'
    });
  },
  rechargeRecords4Report: function(tabName) {
    var startTime = _.getUrlParam('startTime');
    var endTime = _.getUrlParam('endTime');
    var userName = _.getUrlParam('userName');
    this.changeSubReginView(new RechargeRecordsView({
      triggerTab: tabName,
      reqData: {
        username : userName,
        startTime: startTime,
        endTime: endTime
      }
    }), {
      main: {
        title: '查看' + userName + '的充值记录'
      },
      parentRouter: 'ac/rm'
    });
  },
  withdrawRecords4Report: function(tabName) {
    var startTime = _.getUrlParam('startTime');
    var endTime = _.getUrlParam('endTime');
    var userName = _.getUrlParam('userName');
    this.changeSubReginView(new WithdrawRecordsView({
      triggerTab: tabName,
      reqData: {
        username : userName,
        startTime: startTime,
        endTime: endTime
      }
    }), {
      main: {
        title: '查看' + userName + '的提现记录'
      },
      parentRouter: 'ac/rm'
    });
  },

  rushReward: function() {
    this.changeMainReginView(new RushRewardView(), {
      sidebar: 'ac'
    });
  },

  teamProfitAndLoss: function(){
    this.changeMainReginView(new ProfitAndLossView(), {
      sidebar: 'ac',
      topView: 'team'
    });
  }
});

module.exports = AgencyCenterController;
