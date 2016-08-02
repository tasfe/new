"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PasswordManageView = require('accountCenter/views/passwordManage');
var SecurityQuestionView = require('accountCenter/views/securityQuestion');
var LoginLogView = require('accountCenter/views/loginLog');

var AccountCenterController = RouterController.extend({

  // loginPwd:function () {
  //   this.changeMainReginView(new PasswordManageView(),{
  //
  //   });
  // }


  loginPwd: function() {
    this.changeMainReginView(new PasswordManageView(), {
      sidebar: Global.ui.menu.get(['pc'])
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  fundPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFundPwd'
    }), {
      sidebar: Global.ui.menu.get(['pc'])
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  findPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFindPwd'
    }), {
      sidebar: Global.ui.menu.get(['pc'])
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  securityQuestion: function() {
    this.changeMainReginView(new SecurityQuestionView(), {
      sidebar: Global.ui.menu.get(['pc'])
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  loginLog: function() {
    this.changeMainReginView(new LoginLogView(), {
      sidebar: Global.ui.menu.get(['pc'])
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  }
  

});

module.exports = AccountCenterController;
