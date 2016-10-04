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
      sidebar: Global.ui.menu.get(['at'])
    });
    $('#main > .clearfix').addClass('ac-block');
  },
  agencyActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:0
    }), {
      sidebar: Global.ui.menu.get(['at'])
    });
    $('#main > .clearfix').addClass('ac-block');
  },
  ticketActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:1
    }), {
      sidebar: Global.ui.menu.get(['at'])
    });
    $('#main > .clearfix').addClass('ac-block');
  },
  onlineGameActivity: function() {
    this.changeMainReginView(new ActivityCenterView({
      type:2
    }), {
      sidebar: Global.ui.menu.get(['at'])
    });
    $('#main > .clearfix').addClass('ac-block');
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
