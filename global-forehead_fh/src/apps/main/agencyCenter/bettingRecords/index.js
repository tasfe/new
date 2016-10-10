"use strict";

var TabView = require('com/tabView');

var PersonalView = require('./personal');
var TeamView = require('./team');
var TrackRecords = require('./trackRecords');

var BettingRecordsView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '彩票投注记录',
          name: 'team',
          id: 'jsTeam',
          view: TeamView
        },
        {
          label: '彩票追号记录',
          name: 'records',
          id: 'jsTrackRecords',
          view: TrackRecords
        },
        {
          label: 'AG投注记录',
          name: 'personal',
          id: 'jsPersonal',
          view: PersonalView
        }
      ]
    });
  }
});

module.exports = BettingRecordsView;
