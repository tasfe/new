"use strict";

var AccountCenterController = require('accountCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new AccountCenterController(), {
    'ac/pi': 'personalInfo', // 个人信息
    'as/pl': 'loginPwd', // 登陆密码
    'as/pf': 'fundPwd', // 资金密码
    'as/pz': 'findPwd', // 找到密码
    'as/sq': 'securityQuestion', // 密保问题
    'as/se':'emailBinding', //邮箱绑定

    'fc/pf':'moneyTransfer',
    'as/ll': 'loginLog' // 登录日志
  });
};
