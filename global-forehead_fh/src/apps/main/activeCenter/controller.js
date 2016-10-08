"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var ActivityCenterView = require('activeCenter/views/activityCenter');

var OpenActivityDetailView = require('activeCenter/views/activityCenter');

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
  openActivityDetail: function(ticket) {
    this.changeSubReginView(new OpenActivityDetailView({
      triggerTab: ticket,
      activityId: _.getUrlParam('activityId')
    }), {
      parentRouter: 'at/tb'
    });
  }
});

module.exports = ActiveCenterController;
