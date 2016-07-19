"use strict";

var TabView = require('com/tabView');

var PersonalView = require('./personal');
var TeamView = require('./team');

var TrackRecordsView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '个人记录',
          name: 'personal',
          id: 'jsPersonal',
          view: PersonalView
        },
        {
          label: '团队记录',
          name: 'team',
          id: 'jsTeam',
          view: TeamView
        }
      ]
    });
  }
});

module.exports = TrackRecordsView;
