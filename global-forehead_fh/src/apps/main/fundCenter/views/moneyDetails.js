"use strict";

var TabView = require('com/tabView');

var PersonalView = require('./moneyDetail-personal');
var TeamView = require('./moneyDetail-team');

var MoneyDetailView = TabView.extend({

  //template: require('fundCenter/templates/moneyDetails.html'),
  //
  //events: {},

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

module.exports = MoneyDetailView;