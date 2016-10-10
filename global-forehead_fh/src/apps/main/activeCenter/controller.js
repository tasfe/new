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
    $('#main > .clearfix').addClass('ac-block');
  },
  onlineGameActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:2
    }), {
      sidebar: 'at'
    });
  },
  activityDetail: function(activityId) {
    this.changeSubReginView(new ActivityDetailView({
      // triggerTab: ticket,
      activityId: activityId
    }), {
      parentRouter: 'at/tb'
    });
  }
});

module.exports = ActiveCenterController;
