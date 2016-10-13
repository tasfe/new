"use strict";

var TabView = require('com/tabView');

var BettingRecordsView = require('./betting');
var AGBettingView = require('./agBetting');
var ChaseRecordsView = require('./chaseRecords');

var TeamGamesView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '彩票投注记录',
          id: 'jsTeam',
          name: 'br',
          router: 'tg/br',
          view: BettingRecordsView
        },
        {
          label: '彩票追号记录',
          id: 'jsTrackRecords',
          name: 'tr',
          router: 'tg/tr',
          view: ChaseRecordsView
        },
        {
          label: 'AG投注记录',
          id: 'jsPersonal',
          name: 'abr',
          router: 'tg/abr',
          view: AGBettingView
        }
      ]
    });
  }
});

module.exports = TeamGamesView;
