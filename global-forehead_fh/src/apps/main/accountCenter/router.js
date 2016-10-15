"use strict";

var AccountCenterController = require('accountCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new AccountCenterController(), {
    'pm': 'personalInfo', // 个人信息
    'pm/pl': 'loginPwd', // 登陆密码
    'pm/pf': 'fundPwd', // 资金密码
    'pm/pff': 'forgetFundPwd', // 忘记资金密码
    'pm/pz': 'findPwd', // 找到密码
    'pm/sq': 'securityQuestion', // 密保问题
    'pm/se':'emailBinding', //邮箱绑定

    'fc/pf':'moneyTransfer',
    'as/ll': 'loginLog' // 登录日志
  });
};
