"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PersonalManageView = require('./personalManage');

var PasswordManageView = require('accountCenter/views/passwordManage');

var MoneyTransferView = require('fundCenter/views/moneyTransfer');

var LoginLogView = require('./loginLog');

var AccountCenterController = RouterController.extend({

  personalInfo: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'info'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  loginPwd: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'loginPwd'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  fundPwd: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'fundPwd'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  forgetFundPwd: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'forgetFundPwd'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  securityQuestion: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'securityQuestion'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  emailBinding: function() {
    this.changeMainReginView(new PersonalManageView({
      type: 'emailBinding'
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  moneyTransfer: function() {
    this.changeMainReginView(new MoneyTransferView(), {
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

  loginLog: function() {
    this.changeMainReginView(new LoginLogView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  }
  

});

module.exports = AccountCenterController;
