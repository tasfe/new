"use strict";

var DashboardController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new DashboardController(), {
    '': 'dashboard', // 概览
    ':anything': 'dashboard', // 概览
    //'nb/detail/:noticeId': 'noticeDetail'//公告详情
  });

};
