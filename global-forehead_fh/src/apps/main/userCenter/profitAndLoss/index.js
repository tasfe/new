"use strict";

var TabView = require('com/tabView');

var LotteryView = require('./lottery');
var AGLotteryView = require('./agLottery');

var TeamGamesView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '彩票盈亏',
          name: 'lottery',
          id: 'jsLottery',
          view: LotteryView
        },
        {
          label: 'AG游戏盈亏',
          name: 'agLottery',
          id: 'jsAGLottery',
          view: AGLotteryView
        }
      ]
    });
  }
});

module.exports = TeamGamesView;
