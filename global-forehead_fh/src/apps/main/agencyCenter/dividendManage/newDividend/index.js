
"use strict";

var SearchGrid = require('com/searchGrid');
var TabView = require('com/tabView');

var ReportManageConsumeView = require('agencyCenter/commissionStatistics/index_consume');
var ReportManageLossView = require('agencyCenter/commissionStatistics/index_loss');

var DividendView = TabView.extend({

  className: 'ac-openAccount-view',

  getXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/info.json'
    });
  },

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '消费佣金',
          name: 'personal',
          id: 'jsPersonal',
          view: ReportManageConsumeView
        },
        {
          label: '亏损佣金',
          name: 'team',
          id: 'jsTeam',
          view: ReportManageLossView
        }
      ]
    });
  }
});

module.exports = DividendView;
