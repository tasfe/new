define(function(require, exports, module) {

  var SaleCenterController = require('saleCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new SaleCenterController(), {
      'sc/am': 'advertisementManagement',
      'sc/ca': 'newAdvertisement',
      'sc/cm': 'activityManage',
      'sc/cc': 'newActivity',
      'sc/gv':'gamerView',
      'sc/qm':'questionnaireManage',
      'sc/fm':'feedbackManage',
      'sc/gm':'giftsManage',
      'sc/yc':'commissionCfg',
      'sc/cd':'commissionDetail',
      'sc/cj':'lotteryCfg',
      'sc/ck':'lotteryDetail',
      'sc/cz':'rechargeCardDetail',
      'sc/zy':'luckyCardDetail',
      'sc/jj':'bonusCardDetail',
      'sc/dz':'discountCardDetail',

      'sc/hc':'redCfg',
      'sc/hk':'redDetail',

      'sc/dc':'driftCfg',
      'sc/ds':'driftPickup',
      'sc/dd':'driftThrow',

      'sc/jc':'bonusCfg',
      'sc/jk':'bonusDetail',
      'sc/wc':'agentWageCfg',
      'sc/wd':'agentWageDetail',
      'sc/cl':'agentRewardCfg',
      'sc/lk':'agentRewardDetail',
      'sc/mtc':'moneyTreeCfg',
      'sc/mtq':'moneyTreeDetail',

      'sc/lac':'loginActivityCfg',
      'sc/lad':'loginActivityDetail',

      'sc/tlc':'talentActivityCfg',
      'sc/tlsd':'talentActivitySaleDetails',
      'sc/tlld':'talentActivityLotteryDetails',
      
      'sc/rac': 'rushActivityCfg',
      'sc/rad': 'rushActivityDetails',

      'sc/dac': 'dailyActivityCfg',
      'sc/dad': 'dailyActivityDetails',

      'sc/xsjj':'userAddBonusCfg',
      'sc/jjck':'userAddBonusTotal',
      'sc/bd/conf':'userLoginCfg',
      'sc/bd/total':'userLoginTotal',
      'sc/tz/conf':'userBetEachDayConf',
      'sc/tz/total':'userBetEachDayTotal',

      'sc/gp':'giftPacksConf',
      'sc/gpd':'giftPacksDetail',
      'sc/br':'betRewardConf',
      'sc/brd':'betRewardDetail',

      'sc/brc':'betRebateConf',
      'sc/bri':'betRebateDetail',

      'sc/dsc':'doubleSevenCfg',
      'sc/dsd':'doubleSevenDetail',
      'sc/sf/conf':'bonusConf',

      'sc/ds/conf':'dailySalaryCfg',
      'sc/ds/detail':'dailySalaryDetail',

      'sc/os/conf':'openSendCfg',
      'sc/os/detail':'openSendReport',

      'sc/fs/conf':'firstRechargeSendCfg',
      'sc/fs/detail':'firstRechargeSendRecord'

    });

  };

});