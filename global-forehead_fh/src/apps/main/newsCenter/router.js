"use strict";

var NewsCenterController = require('newsCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new NewsCenterController(), {
    'nc/pn': 'platformNews', //系统通知
    // 'nc/pn/detail/:noticeId': 'platformNewsDetail', //系统通知详情
    'nc/pn/setting': 'platformNewsSetting' //系统通知设置
  });

};
