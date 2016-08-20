"use strict";

var TabView = require('com/tabView');

var PersonalView = require('./personal');
var TeamView = require('./team');

var BettingRecordsView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: 'AG游戏',
          name: 'personal',
          id: 'jsPersonal',
          view: PersonalView
        },
        {
          label: '彩票',
          name: 'team',
          id: 'jsTeam',
          view: TeamView
        }
      ]
    });
  }
});

module.exports = BettingRecordsView;
