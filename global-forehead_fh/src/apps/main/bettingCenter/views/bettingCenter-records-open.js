"use strict";

var ticketConfig = require('skeleton/misc/ticketConfig');

var BettingRecordsView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-records-open.html'),

  events: {
  },

  height: 340,

  tableClass: 'table table-center',

  initialize: function() {
  },

  onRender: function() {
  },

  update: function() {

  }
});

module.exports = BettingRecordsView;
