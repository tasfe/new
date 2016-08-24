"use strict";
require('./misc/index.scss');
var RouterController = require('skeleton/controllers/router');
var BettingButlerView = require('bettingButler/views/index');
var bettingButlerController = RouterController.extend({
  bettingbutler: function() {
    this.changeMainReginView(new BettingButlerView(),{
    });
  }


});

module.exports = bettingButlerController;
