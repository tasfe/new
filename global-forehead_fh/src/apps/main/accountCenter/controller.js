"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PasswordManageView = require('accountCenter/views/passwordManage');
var SecurityQuestionView = require('accountCenter/views/securityQuestion');
var LoginLogView = require('accountCenter/views/loginLog');

var AccountCenterController = RouterController.extend({

  loginPwd: function() {
    this.changeMainReginView(new PasswordManageView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });
  },

  fundPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFundPwd'
    }), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });
  },

  findPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFindPwd'
    }), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });
  },

  securityQuestion: function() {
    this.changeMainReginView(new SecurityQuestionView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });
  },

  loginLog: function() {
    this.changeMainReginView(new LoginLogView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });
  }
});

module.exports = AccountCenterController;
