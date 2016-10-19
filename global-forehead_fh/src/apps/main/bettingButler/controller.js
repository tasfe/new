"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var BettingButlerView = require('./views/index');

var bettingButlerController = RouterController.extend({

  butlerSetPlan: function(type) {
    this.changeMainReginView(new BettingButlerView({
      triggerTab: type
    }), {
      sidebar: 'bb'
    });
  }
});

module.exports = bettingButlerController;
