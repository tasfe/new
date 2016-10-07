"use strict";

var TabView = require('com/tabView');

var LowLevelManageView = require('./lowLevelManage');
var UpgradeListView = require('./upgradeList');
var PointsListView = require('./pointsList');

var VipCreditView = TabView.extend({

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '下级列表',
          name: 'LowLevelManage',
          id: 'jsLowLevelManage',
          view: LowLevelManageView
        },
        {
          label: '调级记录',
          name: 'UpgradeList',
          id: 'jsUpgradeList',
          view: UpgradeListView
        },
        {
          label: '积分情况',
          name: 'PointsList',
          id: 'jsPointsList',
          view: PointsListView
        }
      ],
      menushow: false
    });
  }
});

module.exports = VipCreditView;
