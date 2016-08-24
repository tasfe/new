"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');
var BettingButlerView = require('bettingButler/views/butlerSetPlan');

var bettingButlerController = RouterController.extend({

  butlerSetPlan: function() {
    this.changeMainReginView(new BettingButlerView(),{
    	main: {
			title: '设置计划'
		},
		sidebar: Global.ui.menu.get(['bb'])
    });
  },

  butlerRunPlan: function() {
    this.changeMainReginView(new BettingButlerView(),{
    	main: {
			title: '进行中的计划'
		},
		sidebar: Global.ui.menu.get(['bb'])
    });
  },

  butlerColPlan: function() {
    this.changeMainReginView(new BettingButlerView(),{
    	main: {
			title: '我的收藏方案'
		},
		sidebar: Global.ui.menu.get(['bb'])
    });
  }
});

module.exports = bettingButlerController;
