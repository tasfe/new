"use strict";

var NewsCenterController = require('newsCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new NewsCenterController(), {
    // 'nc/pn': 'platformNews', //系统通知
    // 'nc/pn/detail/:noticeId': 'platformNewsDetail', //系统通知详情
    //'nc/pn/setting': 'platformNewsSetting', //系统通知设置
    //'nc/il': 'insideLetter', //站内信
    'nc/il/detail/:titleId/:letterId': 'insideLetterDetail', //站内信详情
    'nc/il/send': 'insideLetterSend' //发送站内信
  });

};
