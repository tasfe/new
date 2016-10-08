define(function (require, exports, module) {

  var GlobalCenterController = require('globalCenter/controller');

  exports.install = function () {

    window.Global.appRouter.processAppRoutes(new GlobalCenterController(), {
      'gc/rl': 'registerAndLogin',
      'gc/sw': 'sensitiveWord',
      'gc/bl': 'blackListOfIP',
      'gc/dn':'domainNameManagement'
    });

  };

});