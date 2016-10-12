"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PasswordManageView = require('accountCenter/views/passwordManage');

// var PwdAdministration = require('accountCenter/views/pwdAdministration');



var SecurityQuestionView = require('accountCenter/views/securityQuestion');
var LoginLogView = require('accountCenter/views/loginLog');
var settingEmailView = require('accountCenter/views/settingEmail');
var MoneyTransferView = require('fundCenter/views/moneyTransfer');

var AccountCenterController = RouterController.extend({

  moneyTransfer: function() {
    this.changeMainReginView(new MoneyTransferView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },


  settingEmail: function() {
    this.changeMainReginView(new settingEmailView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },
  

  loginPwd: function() {
    this.changeMainReginView(new PasswordManageView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  fundPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFundPwd'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  findPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFindPwd'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  securityQuestion: function() {
    this.changeMainReginView(new SecurityQuestionView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  loginLog: function() {
    this.changeMainReginView(new LoginLogView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  }
  

});

module.exports = AccountCenterController;
