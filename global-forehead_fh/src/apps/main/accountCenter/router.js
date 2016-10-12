"use strict";

var AccountCenterController = require('accountCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new AccountCenterController(), {
    'ac/pm': 'personalInfo', // 个人信息
    'as/pm/pl': 'loginPwd', // 登陆密码
    'as/pm/pf': 'fundPwd', // 资金密码
    'as/pm/pz': 'findPwd', // 找到密码
    'as/pm/sq': 'securityQuestion', // 密保问题
    'as/pm/se':'emailBinding', //邮箱绑定

    'fc/pf':'moneyTransfer',
    'as/ll': 'loginLog' // 登录日志
  });
};
