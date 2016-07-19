"use strict";

var RouterController = require('skeleton/controllers/router');

var DashboardView = require('dashboard/views/dashboard');

var NoticeDetailView = require('dynamicCenter/views/noticeDetail');

var DashboardController = RouterController.extend({

  dashboard: function() {
    Base.log('路由 -> 概览');
    this.changeMainReginView(new DashboardView());
  }

  //noticeDetail: function(noticeId) {
  //  this.changeMainReginView(new NoticeDetailView({
  //    noticeId:noticeId
  //  }), {
  //    main: {
  //      title: '平台动态',
  //      subReturn: true
  //    },
  //    sidebar: Global.ui.menu.get(['ac', 'uc', 'aa']),
  //    parentRouter: '#'
  //  });
  //}

});

module.exports = DashboardController;
