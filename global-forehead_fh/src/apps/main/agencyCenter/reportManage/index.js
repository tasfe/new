"use strict";

var TabView = require('com/tabView');

var PersonalReportView = require('agencyCenter/reportManage/personalReport');
var TeamReportView = require('agencyCenter/reportManage/teamReport');

var OnlineRechargeView = TabView.extend({

  className: 'ac-reportManage-view',

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '个人记录',
          name: 'personal',
          id: 'jsACPersonalReportManagement',
          view: PersonalReportView
        },
        {
          label: '团队记录',
          name: 'team',
          id: 'jsACTeamReportManagement',
          view: TeamReportView
        }
      ]
    });
  }
});

module.exports = OnlineRechargeView;
