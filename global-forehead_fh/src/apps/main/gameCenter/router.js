"use strict";

var GameCenterController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new GameCenterController(), {
    'gc': 'gameCenter'
  });
};
