define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var RechargeListView = require('fundCenter/views/recharge-RechargeRecord');
  var AbnormalRechargeView = require('fundCenter/views/recharge-AbnormalRecharge');
  var RechargeSetView = require('fundCenter/views/recharge-RechargeSet');
  var LargeRechargeView = require('fundCenter/views/recharge-LargeRecharge');

  var NormalWithdrawDepositView = require('fundCenter/views/withdraw-NormalWithdrawDeposit');
  var AbnormalWithdrawDepositView = require('fundCenter/views/withdraw-AbnormalWithdrawDeposit');
  var WithdrawDepositSetView = require('fundCenter/views/withdraw-WithdrawDepositSet');

  var TransferAccountSetView = require('fundCenter/views/transfer-TransferAccountSet');

  var ManualOperateCheckView = require('fundCenter/views/fund-ManualOperateCheck');
  var ManualOperateApplyView = require('fundCenter/views/fund-ManualOperateApply');

  var AccountDetailView = require('fundCenter/views/account-AccountDetailView');

  var BankManagementView = require('fundCenter/views/bank-BankManagement');
  var UserCardManagementView = require('fundCenter/views/bank-UserCardManagement');
  var CardBlackListView = require('fundCenter/views/bank-CardBlackList');
  var CompanyCardManagementView = require('fundCenter/views/bank-CompanyCardManagement');


  var AuditRescindContractView = require('fundCenter/views/bonus-AuditRescindContract');
  var FirstGenerationManView = require('fundCenter/views/bonus-FirstGenerationMan');
  var GeneralAgentManagementView = require('fundCenter/views/bonus-GeneralAgentManagement');
  var SignUserRecordView = require('fundCenter/views/bonus-SignUserRecord');
  var GeneralAgentSetView = require('fundCenter/views/bonus-GeneralAgentSet');

  var RedPacketRuleView = require('fundCenter/redPacket/redPacket-Rule');
  var RedPacketListView = require('fundCenter/redPacket/redPacket-List');

  var ThirdBankManagementView =require('fundCenter/bankManagement/bank-ThirdBankManagement');

  var RechargeManagementView = require('fundCenter/rwManagement/recharge');
  var TakeoutManagementView = require('fundCenter/rwManagement/takeout');

  var RechargeSetMobileView = require('fundCenter/views/recharge-RechargeSet-Mobile');
  var RechargeMobileManagementView = require('fundCenter/rwManagement/recharge-Mobile');

  var DailyDividManagementView = require('fundCenter/views/bonus-DailyDividManagement');

  var SalesAccountManagementView = require('fundCenter/views/bonus-salesAccountManagement');

  var FundCenterController = RouterController.extend({

    rechargeRecord: function () {
      this.changeMainReginView(new RechargeListView());
    },

    abnormalRecharge: function () {
      this.changeMainReginView(new AbnormalRechargeView());
    },

    rechargeSet: function () {
      this.changeMainReginView(new RechargeSetView());
    },

    largeRecharge: function () {
      this.changeMainReginView(new LargeRechargeView());
    },

    normalWithdrawDeposit: function () {
      this.changeMainReginView(new NormalWithdrawDepositView());
    },

    abnormalWithdrawDeposit: function () {
      this.changeMainReginView(new AbnormalWithdrawDepositView());
    },

    withdrawDepositSet: function () {
      this.changeMainReginView(new WithdrawDepositSetView());
    },

    transferAccountSet: function () {
      this.changeMainReginView(new TransferAccountSetView());
    },

    manualOperateCheck: function () {
      this.changeMainReginView(new ManualOperateCheckView());
    },

    manualOperateApply: function () {
      this.changeMainReginView(new ManualOperateApplyView());
    },

    accountDetail: function () {
      this.changeMainReginView(new AccountDetailView());
    },

    bankManagement: function () {
      this.changeMainReginView(new BankManagementView());
    },

    rechargeManagement: function () {
      this.changeMainReginView(new RechargeManagementView());
    },

    takeoutManagement: function() {
      this.changeMainReginView(new TakeoutManagementView());
    },

    userCardManagement: function () {
      this.changeMainReginView(new UserCardManagementView());
    },

    cardBlackList: function () {
      this.changeMainReginView(new CardBlackListView());
    },

    companyCardManagement: function () {
      this.changeMainReginView(new CompanyCardManagementView());
    },

    generalAgentSet: function () {
      this.changeMainReginView(new GeneralAgentSetView());
    },
    generalAgentManagement: function () {
      this.changeMainReginView(new GeneralAgentManagementView());
    },
    firstGenerationMan: function () {
      this.changeMainReginView(new FirstGenerationManView());
    },
    signUserRecord: function () {
      this.changeMainReginView(new SignUserRecordView());
    },
    auditRescindContract: function () {
      this.changeMainReginView(new AuditRescindContractView());
    },

    redPacketRule: function () {
      this.changeMainReginView(new RedPacketRuleView());
    },
    redPacketList: function () {
      this.changeMainReginView(new RedPacketListView());
    },
    thirdBankManagement: function(){
      this.changeMainReginView(new ThirdBankManagementView());
    },
    rechargeSetMobile: function(){
      this.changeMainReginView(new RechargeSetMobileView());
    },
    rechargeMobileManagement: function () {
      this.changeMainReginView(new RechargeMobileManagementView());
    },

    dailyDividManagement:function(){
      this.changeMainReginView(new DailyDividManagementView())
    },

    salesAccountManagement: function () {
      this.changeMainReginView(new SalesAccountManagementView());
    }
  });

  module.exports = FundCenterController;

});