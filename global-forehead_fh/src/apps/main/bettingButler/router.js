"use strict";

var bettingButlerController = require('bettingButlerController/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new bettingButlerController(), {
    'bbc/sp': 'bettingbutler'
  });

};
