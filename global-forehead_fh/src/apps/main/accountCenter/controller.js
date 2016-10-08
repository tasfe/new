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
      sidebar: 'pc'
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },


  settingEmail: function() {
    this.changeMainReginView(new settingEmailView(), {
      sidebar: 'pc'
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },
  

  loginPwd: function() {
    this.changeMainReginView(new PasswordManageView(), {
      sidebar: 'pc'
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  // loginPwd: function() {
  //   this.changeMainReginView(new PwdAdministration(), {
  //     sidebar: 'pc'
  //   });
  //
  //   var PublicView = require('userCenter/views/publicView');
  //   var publicView = new PublicView();
  //   publicView.checkState();
  // },

  fundPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFundPwd'
    }), {
      sidebar: 'pc'
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  findPwd: function() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFindPwd'
    }), {
      sidebar: 'pc'
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  securityQuestion: function() {
    this.changeMainReginView(new SecurityQuestionView(), {
      sidebar: 'pc'
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  loginLog: function() {
    this.changeMainReginView(new LoginLogView(), {
      sidebar: 'pc'
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  }
  

});

module.exports = AccountCenterController;
