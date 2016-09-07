define(function(require, exports, module) {

  var FundCenterController = require('fundCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new FundCenterController(), {
      'fc/rr': 'rechargeRecord',
      'fc/ar': 'abnormalRecharge',
      'fc/rs': 'rechargeSet',
      'fc/lr': 'largeRecharge',
      'fc/nw': 'normalWithdrawDeposit',
      'fc/aw': 'abnormalWithdrawDeposit',
      'fc/wd': 'withdrawDepositSet',
      'fc/ta': 'transferAccountSet',
      'fc/mc': 'manualOperateCheck',
      'fc/ma': 'manualOperateApply',
      'fc/ad': 'accountDetail',
      'fc/bm': 'bankManagement',
      'fc/tp': 'rechargeManagement',
      'fc/to': 'takeoutManagement',
      'fc/uc': 'userCardManagement',
      'fc/cb': 'cardBlackList',
      'fc/cc': 'companyCardManagement',

      'fc/gs': 'generalAgentSet',
      'fc/gm': 'generalAgentManagement',
      'fc/fm': 'firstGenerationMan',
      'fc/su': 'signUserRecord',
      'fc/ac': 'auditRescindContract',
      'fc/sm': 'salesAccountManagement',

      'fc/grc': 'redPacketRule',
      'fc/grr': 'redPacketList',

      'fc/tbm': 'thirdBankManagement',

      'fc/rsm': 'rechargeSetMobile',
      'fc/tpm': 'rechargeMobileManagement',

      'fc/dd': 'dailyDividManagement'

    });

  };

});