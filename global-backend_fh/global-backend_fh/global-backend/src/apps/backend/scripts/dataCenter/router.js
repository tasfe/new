  define(function(require, exports, module) {

  var DataCenterController = require('dataCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new DataCenterController(), {
      'dc/pl': 'agencyProfitAndLossReport',
      'dc/pl2': 'profitAndLossReport',
      'dc/rw': 'rechargeAndWithdrawReport',
      'dc/tr': 'transferReport',
      'dc/lt': 'ticketProfitAndLossReport',
      'dc/lt/play': 'playProfitAndLossReport',
      'dc/br': 'balanceReport'
    });

  };

});