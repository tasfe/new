define(function(require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var AdvertisementManagementView = require('saleCenter/views/advertisementManagement');
  var NewAdvertisementView = require('saleCenter/views/newAdvertisement');
  var ActivityManageView = require('saleCenter/views/activityManage');
  var NewActivityView = require('saleCenter/views/newActivity');
  var GamerView = require('saleCenter/views/games-gamerView');
  var QuestionnaireManageView = require('saleCenter/views/games-questionnaireManage');
  var FeedbackManageView = require('saleCenter/views/games-feedbackManage');
  var GiftsManageView = require('saleCenter/views/games-giftsManage');
  var commissionCfgView = require('saleCenter/views/commissionCfg');
  var commissionDetailView = require('saleCenter/views/commissionDetail');

  var LotteryCfgView = require('saleCenter/views/games-lotteryCfg');
  var LotteryDetailView = require('saleCenter/views/games-lotteryDetail');
  var RechargeCardDetailView = require('saleCenter/views/games-rechargeCardDetail');
  var LuckyCardDetailView = require('saleCenter/views/games-luckyCardDetail');
  var BonusCardDetailView = require('saleCenter/views/games-bonusCardDetail');
  var DiscountCardDetailView = require('saleCenter/views/games-discountCardDetail');
  var RedCfgView = require('saleCenter/views/games-redCfg');
  var RedDetailView = require('saleCenter/views/games-redDetail');
  var BonusCfgView = require('saleCenter/views/games-bonusCfg');
  var BonusDetailView = require('saleCenter/views/games-bonusDetail');

  var AgentWageCfgView = require('saleCenter/views/games-agentWageCfg');
  var AgentWageDetailView = require('saleCenter/views/games-agentWageDetail');
  var AgentRewardCfgView = require('saleCenter/views/games-agentRewardCfg');
  var AgentRewardDetailView = require('saleCenter/views/games-agentRewardDetail');

  var MoneyTreeCfgView = require('saleCenter/views/games-moneyTreeConfig');
  var MoneyTreeDetailView = require('saleCenter/views/games-moneyTreeDetail');

  var DriftCfgView = require('saleCenter/drift/config');
  var DriftPickupView = require('saleCenter/drift/pickup');
  var DriftThrowView = require('saleCenter/drift/throw');

  var LoginActivityCfgView = require('saleCenter/loginActivity/config');
  var LoginActivityDetailView = require('saleCenter/loginActivity/detail');

  var TalentActivityCfgView = require('saleCenter/talentActivity/config');
  var TalentActivitySaleDetailsView = require('saleCenter/talentActivity/saleDetails');
  var TalentActivityLotteryDetailsView = require('saleCenter/talentActivity/lotteryDetails');

  var RushActivityCfgView = require('saleCenter/rushActivity/config');
  var RushActivityDetailsView = require('saleCenter/rushActivity/details');

  var DailyActivityCfgView = require('saleCenter/dailyActivity/config');
  var DailyActivityDetailsView = require('saleCenter/dailyActivity/details');

  var UserAddBonusCfgView = require('saleCenter/views/games-userAddBonusCfg');
  var UserAddBonusTotalView = require('saleCenter/views/games-userAddBonusTotal');

  var UserLoginCfgView=require('saleCenter/views/games-userLoginCfg');
  var UserLoginTotalView=require('saleCenter/views/games-userLoginList');
  var UserBetEachDayCfgView=require('saleCenter/views/games-userBetEachDayCfg');
  var UserBetEachDayTotalView=require('saleCenter/views/games-userBetEachDayList');


  var GiftPacksCfgView=require('saleCenter/views/activity-giftPacksCfg');
  var GiftPacksDetailView=require('saleCenter/views/activity-giftPacksDetail');
  var BetRewardCfgView=require('saleCenter/views/activity-betRewardCfg');
  var BetRewardDetailView=require('saleCenter/views/activity-betRewardDetail');

  var BetRebateCfgView = require('saleCenter/views/activity-betRebateCfg');
  var BetRebateDetailView = require('saleCenter/views/activity-betRebateDetail');

  var DoubleSevenCfgView = require('saleCenter/views/activity-doubleSevenCfg');
  var DoubleSevenDetailView = require('saleCenter/views/activity-doubleSevenDetail');


  var SaleCenterController = RouterController.extend({

    advertisementManagement: function() {
      this.changeMainReginView(new AdvertisementManagementView());
    },
    newAdvertisement: function() {
      this.changeMainReginView(new NewAdvertisementView());
    },
    activityManage: function() {
      this.changeMainReginView(new ActivityManageView());
    },
    newActivity: function() {
      this.changeMainReginView(new NewActivityView());
    },
    gamerView: function() {
      this.changeMainReginView(new GamerView());
    },
    questionnaireManage: function() {
      this.changeMainReginView(new QuestionnaireManageView());
    },
    feedbackManage: function() {
      this.changeMainReginView(new FeedbackManageView());
    },
    giftsManage: function() {
      this.changeMainReginView(new GiftsManageView());
    },
    commissionCfg: function() {
      this.changeMainReginView(new commissionCfgView());
    },
    commissionDetail: function() {
      this.changeMainReginView(new commissionDetailView());
    },
    lotteryCfg: function() {
      this.changeMainReginView(new LotteryCfgView());
    },
    lotteryDetail: function() {
      this.changeMainReginView(new LotteryDetailView());
    },
    rechargeCardDetail: function() {
      this.changeMainReginView(new RechargeCardDetailView());
    },
    luckyCardDetail: function() {
      this.changeMainReginView(new LuckyCardDetailView());
    },
    bonusCardDetail: function() {
      this.changeMainReginView(new BonusCardDetailView());
    },
    discountCardDetail: function() {
      this.changeMainReginView(new DiscountCardDetailView());
    },

    redCfg: function() {
      this.changeMainReginView(new RedCfgView());
    },
    redDetail: function() {
      this.changeMainReginView(new RedDetailView());
    },

    driftCfg: function() {
      this.changeMainReginView(new DriftCfgView());
    },
    driftPickup: function() {
      this.changeMainReginView(new DriftPickupView());
    },
    driftThrow: function() {
      this.changeMainReginView(new DriftThrowView());
    },

    bonusCfg: function() {
      this.changeMainReginView(new BonusCfgView());
    },
    bonusDetail: function() {
      this.changeMainReginView(new BonusDetailView());
    },
    agentWageCfg: function() {
      this.changeMainReginView(new AgentWageCfgView());
    },
    agentWageDetail: function() {
      this.changeMainReginView(new AgentWageDetailView());
    },
    agentRewardCfg: function() {
      this.changeMainReginView(new AgentRewardCfgView());
    }
    ,
    agentRewardDetail: function() {
      this.changeMainReginView(new AgentRewardDetailView());
    },
    moneyTreeCfg: function() {
      this.changeMainReginView(new MoneyTreeCfgView());
    },
    moneyTreeDetail: function() {
      this.changeMainReginView(new MoneyTreeDetailView());
    },

    loginActivityCfg: function(){
      this.changeMainReginView(new LoginActivityCfgView());
    },
    loginActivityDetail: function(){
      this.changeMainReginView(new LoginActivityDetailView());
    },

    talentActivityCfg: function() {
      this.changeMainReginView(new TalentActivityCfgView());
    },

    talentActivitySaleDetails: function() {
      this.changeMainReginView(new TalentActivitySaleDetailsView());
    },

    talentActivityLotteryDetails: function() {
      this.changeMainReginView(new TalentActivityLotteryDetailsView());
    },

    rushActivityCfg: function() {
      this.changeMainReginView(new RushActivityCfgView());
    },

    rushActivityDetails: function() {
      this.changeMainReginView(new RushActivityDetailsView());
    },

    dailyActivityCfg: function() {
      this.changeMainReginView(new DailyActivityCfgView());
    },

    dailyActivityDetails: function() {
      this.changeMainReginView(new DailyActivityDetailsView());
    },

    userAddBonusCfg: function() {
      this.changeMainReginView(new UserAddBonusCfgView());
    },

    userAddBonusTotal: function() {
      this.changeMainReginView(new UserAddBonusTotalView());
    },

    userLoginCfg:function() {
      this.changeMainReginView(new UserLoginCfgView());
    },
    userLoginTotal:function() {
      this.changeMainReginView(new UserLoginTotalView());
    },
    userBetEachDayConf:function() {
      this.changeMainReginView(new UserBetEachDayCfgView());
    },
    userBetEachDayTotal:function() {
      this.changeMainReginView(new UserBetEachDayTotalView());
    },

    giftPacksConf:function() {
      this.changeMainReginView(new GiftPacksCfgView());
    },
    giftPacksDetail:function() {
      this.changeMainReginView(new GiftPacksDetailView());
    },
    betRewardConf:function() {
      this.changeMainReginView(new BetRewardCfgView());
    },
    betRewardDetail:function() {
      this.changeMainReginView(new BetRewardDetailView());
    },

    betRebateConf: function () {
      this.changeMainReginView(new BetRebateCfgView());
    },
    betRebateDetail: function () {
      this.changeMainReginView(new BetRebateDetailView());
    },

    doubleSevenCfg:function(){
      this.changeMainReginView(new DoubleSevenCfgView());
    },
    doubleSevenDetail:function(){
      this.changeMainReginView(new DoubleSevenDetailView());
    }

  });
  module.exports = SaleCenterController;

});