"use strict";

var RouterController = require('skeleton/controllers/router');

var ActiveCenterView = require('activeCenter/views/activeCenter');

var ActiveCenterController = RouterController.extend({

  activeCenter: function() {
    this.changeMainReginView(new ActiveCenterView(), {
      main: {
        title: '活动中心'
      },
      sidebar: Global.ui.menu.get(['ac', 'uc', 'aa'])
    });
  }
});

module.exports = ActiveCenterController;
