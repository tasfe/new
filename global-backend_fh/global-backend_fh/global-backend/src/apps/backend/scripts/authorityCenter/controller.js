define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var AuthorizationGroupsManageView = require('authorityCenter/views/authorizationGroupsManage');
  var ViewAuthorizationGroupView = require('authorityCenter/views/authorizationGroupsManage-View');
  var AddAuthorizationGroupView = require('authorityCenter/views/authorizationGroupsManage-Add');
  var UpdateAuthorizationGroupView = require('authorityCenter/views/authorizationGroupsManage-Update');


  var CreateAuthorizationGroupView = require('authorityCenter/views/createAuthorizationGroup');
  var UserManagementView = require('authorityCenter/views/userManagement');
  var CreateUserView = require('authorityCenter/views/createUser');
  var OperateLogsView = require('authorityCenter/views/operateLogs');
  var UpdatePasswordView = require('authorityCenter/views/updatePassword');

  var AuthorityCenterController = RouterController.extend({

    authorizationGroupsManage: function () {
      this.changeMainReginView(new AuthorizationGroupsManageView());
    },
    viewAuthorizationGroup: function () {
      this.changeSubReginView(new ViewAuthorizationGroupView(), {
        parentRouter: 'am/gm'
      });
    },
    updateAuthorizationGroup: function () {
      this.changeSubReginView(new UpdateAuthorizationGroupView(), {
        parentRouter: 'am/gm'
      });
    },
    addAuthorizationGroup: function () {
      this.changeSubReginView(new AddAuthorizationGroupView(), {
        parentRouter: 'am/gm'
      });
    },
    createAuthorizationGroup: function () {
      this.changeMainReginView(new CreateAuthorizationGroupView());
    },
    userManagement: function () {
      this.changeMainReginView(new UserManagementView());
    },
    createUser: function () {
      this.changeMainReginView(new CreateUserView());
    },
    operateLogs: function () {
      this.changeMainReginView(new OperateLogsView());
    },
    updatePassword: function () {
      this.changeMainReginView(new UpdatePasswordView());
    }

  });

  module.exports = AuthorityCenterController;

});