"use strict";

var bettingButlerController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new bettingButlerController(), {
    'bb/:type': 'butlerSetPlan'
  });

};
