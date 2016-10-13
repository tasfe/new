"use strict";
require('./index.scss');
var TabView = require('com/tabView');

var BettingRecordsView = require('./betting');
var AGBettingView = require('./agBetting');
var TrackRecordsView = require('./trackRecords');

var TeamGamesView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '彩票投注记录',
          name: 'br',
          id: 'jsTeam',
          router: 'gr/br',
          view: BettingRecordsView
        },
        {
          label: '彩票追号记录',
          name: 'tr',
          id: 'jsTrackRecords',
          router: 'gr/tr',
          view: TrackRecordsView
        },
        {
          label: 'AG投注记录',
          name: 'abr',
          id: 'jsPersonal',
          router: 'gr/abr',
          view: AGBettingView
        }
      ]
    });
  }
});

module.exports = TeamGamesView;
