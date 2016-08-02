"use strict";

var BettingCenterController = require('bettingCenter/controller');

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new BettingCenterController(), {
    'bc/:type': 'bettingCenter'
  });

};
