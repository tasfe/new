"use strict";

var AccountCenterController = require('accountCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new AccountCenterController(), {
    'as/se':'settingEmail',
    'as/pl': 'loginPwd', // 密码管理
    'as/pf': 'fundPwd', // 密码管理
    'as/pz': 'findPwd', // 密码管理
    'as/sq': 'securityQuestion', // 密保问题
    'as/ll': 'loginLog' // 登录日志
  });
};
