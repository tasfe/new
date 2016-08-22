"use strict";

var DynamicController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new DynamicController(), {
    // 'nc/nb':'noticeBoard',//公告板
    // 'nc/nb/detail/:noticeId': 'noticeDetail'//公告详情
  });

};
