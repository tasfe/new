define(function (require, exports, module) {

  var BetCenterController = require('betCenter/controller');

  exports.install = function () {

    window.Global.appRouter.processAppRoutes(new BetCenterController(), {
      'bc/tl': 'ticketList',
      'bc/tl/bonus/:ticketId':'bonusSet',
      'bc/tl/betLimit/:ticketId':'betLimit',
      'bc/tl/playDetail/:ticketId':'playDetail',
      'bc/tl/playStatus/:ticketId':'playStatus',
      'bc/tl/params/:ticketId':'paramsSet',
      'bc/tl/mmcParams/:ticketId':'mmcParamsSet',
      'bc/tl/mmcParams/:ticketId/injectBonusList':'injectBonusList',
      'bc/tl/mmcParams/:ticketId/specifyUser':'specifyUser',
      'bc/tl/planRules/:ticketId':'planRuleSet',

      'bc/tl/riskList/:ticketId':'riskList',
      'bc/tl/riskDetail/:ticketId/:ticketPlanId':'riskDetail',


      'bc/lm': 'lotteryMonitor',
      'bc/lm/detail/:ticketResultId': 'lotteryDetail',
      'bc/li': 'lotteryInterface',
      'bc/br': 'bettingRecord',
      'bc/br/detail/:ticketTradeNo': 'bettingRecordDetail',
      'bc/cr': 'chaseRecord',
      'bc/cr/detail/:tradeNo': 'chaseRecordDetail',
      'bc/ac': 'abnormalBettingCheck',
      'bc/am': 'abnormalBettingManage'

    });

  };

});