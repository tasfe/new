"use strict";
require('./misc/index.scss');
var RouterController = require('skeleton/controllers/router');
var ButlerSetPlan = require('bettingButler/views/butlerSetPlan');
var ButlerRunPlan = require('bettingButler/views/butlerRunPlan');
var ButlerColPlan = require('bettingButler/views/butlerColPlan');
var bettingButlerController = RouterController.extend({

  butlerSetPlan: function() {
    this.changeMainReginView(new ButlerSetPlan(),{
      main: {
  			title: '设置计划'
  		},
  		sidebar: Global.ui.menu.get(['bb'])
    });

    $('#main > .clearfix').addClass('bb-block');
  },

  butlerRunPlan: function() {
    this.changeMainReginView(new ButlerRunPlan(),{
      main: {
  			title: '进行中的计划'
  		},
  		sidebar: Global.ui.menu.get(['bb'])
    });

    $('#main > .clearfix').addClass('bb-block');
  },

  butlerColPlan: function() {
    this.changeMainReginView(new ButlerColPlan(),{
      main: {
  			title: '我的收藏方案'
  		},
  		sidebar: Global.ui.menu.get(['bb'])
    });

    $('#main > .clearfix').addClass('bb-block');
  }
});

module.exports = bettingButlerController;
