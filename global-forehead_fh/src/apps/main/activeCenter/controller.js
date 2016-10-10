"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var ActivityCenterView = require('activeCenter/views/activityCenter');

var ActivityDetailView = require('activeCenter/views/activityDetail');

var ActiveCenterController = RouterController.extend({
  activityCenter: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:''
    }), {
      sidebar: 'at'
    });
  },
  agencyActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:0
    }), {
      sidebar: 'at'
    });
  },
  ticketActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:1
    }), {
      sidebar: 'at'
    });
  },
  onlineGameActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:2
    }), {
      sidebar: 'at'
    });
  },
  activityDetail: function(type, activityId) {
    this.changeSubReginView(new ActivityDetailView({
      activityId: activityId
    }), {
      main: {
        title: '活动详情',
        subReturn: true
      },
      parentRouter: 'at/tb'
    });
  }
});

module.exports = ActiveCenterController;
