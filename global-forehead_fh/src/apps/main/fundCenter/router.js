define(function(require, exports, module) {

  var FundCenterController = require('fundCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new FundCenterController(), {
      'fc/pt': 'platformTransfer',
      'uc/ad': 'accountDetails'
    });
  };

});