define(function(require, exports, module) {

  var DashboardController = require('dashboard/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new DashboardController(), {
      '': 'dashboard' // 概览
    });

  };

});