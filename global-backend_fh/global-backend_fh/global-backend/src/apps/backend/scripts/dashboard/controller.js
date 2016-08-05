define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var DashboardView = require('dashboard/views/dashboard');

  var DashboardController = RouterController.extend({

    dashboard: function() {
      Base.log('路由 -> 概览');
      this.changeMainReginView(new DashboardView());
    }

  });

  module.exports = DashboardController;

});