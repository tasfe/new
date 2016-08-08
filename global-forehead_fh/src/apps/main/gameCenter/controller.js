"use strict";

var RouterController = require('skeleton/controllers/router');

var GameCenterView = require('gameCenter/index');

var GameCenterController = RouterController.extend({

  gameCenter: function() {
    this.changeMainReginView(new GameCenterView());
  }
});

module.exports = GameCenterController;
