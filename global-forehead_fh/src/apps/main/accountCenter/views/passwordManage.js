"use strict";

var TabView = require('com/tabView');

var loginPwdView = require('accountCenter/views/passwordManage-loginPwd');
var fundPwdView = require('accountCenter/views/passwordManage-fundPwd');
var findPwdView = require('accountCenter/views/passwordManage-findPwd');

var passwordManageView = TabView.extend({

  events: {
    
  },

  className: 'as-passwordManage',

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '修改登录密码',
          name: 'modifyLogPwd',
          id: 'jsLogManage',
          router: 'as/pl',
          view: loginPwdView
        },
        {
          label: '修改资金密码',
          name: 'modifyFundPwd',
          id: 'jsFundManage',
          router: 'as/pf',
          view: fundPwdView
        },
        {
          label: '找回资金密码',
          name: 'modifyFindPwd',
          id: 'jsFindManage',
          router: 'as/pz',
          view: findPwdView
        }
      ]
    });
  }
});

module.exports = passwordManageView;
