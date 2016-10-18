"use strict";

var TabView = require('com/tabView');

var PlanSettingView = require('bettingButler/planSetting');
var PlanListView = require('bettingButler/planList');
var MyCollectionsView = require('bettingButler/myCollections');

var BettingButlerView = TabView.extend({

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '设置计划',
          name: 'ps',
          id: 'jsPlanSetting',
          router: 'bb/ps',
          view: PlanSettingView
        },
        {
          label: '进行中的计划',
          name: 'pl',
          id: 'jsPlanList',
          router: 'bb/pl',
          view: PlanListView
        },
        {
          label: '我的收藏方案',
          name: 'mc',
          id: 'jsMyCollection',
          router: 'bb/mc',
          view: MyCollectionsView
        }
      ]
    });
  }
});

module.exports = BettingButlerView;
