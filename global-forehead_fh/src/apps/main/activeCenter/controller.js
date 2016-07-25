"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var ActiveCenterView = require('activeCenter/views/activeCenter');

var ActiveCenterView1 = require('activeCenter/views/activeCenter1');

var ActiveCenterController = RouterController.extend({

  // activeCenter: function() {
  //   this.changeMainReginView(new ActiveCenterView(), {
  //     main: {
  //       title: '活动中心'
  //     },
  //     sidebar: Global.ui.menu.get(['ac', 'uc', 'aa'])
  //   });
  // },
  activeCenter1: function() {
    this.changeMainReginView(new ActiveCenterView1(), {
      // main: {
      //   title: '活动中心'
      // },
      // sidebar: Global.ui.menu.get(['ac', 'uc', 'aa'])
    });
  }
  
  
});

module.exports = ActiveCenterController;
