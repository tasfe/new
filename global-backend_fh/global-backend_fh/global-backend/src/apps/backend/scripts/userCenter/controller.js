define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var UserDetailView = require('userCenter/views/user-userDetails');//查询用户详情
  var UserSecurityView = require('userCenter/views/user-userSecurity');
  var UserBonusView = require('userCenter/views/user-userBonus');//查询用户奖金详情
  var UserListView = require('userCenter/views/user-userList');//用户列表

  var DistributorListView = require('userCenter/views/user-DistributorList');//直属号管理
  var NewDistributorView = require('userCenter/views/user-NewDistributor');//指数好开户

  var DisabledUserListView = require('userCenter/views/abnormalUser-disabledUserList');//冻结用户
  var EnabledUserListView = require('userCenter/views/abnormalUser-enabledUserList');//解冻用户
  var RecycleUserListView = require('userCenter/views/abnormalUser-recycleUserList');//回收用户
  var ResetUserListView = require('userCenter/views/abnormalUser-resetUserList');//用户申诉
  var QuotaManageView = require('userCenter/views/quotaManage');
  var DropUserListView = require('userCenter/views/abnormalUser-dropUserList');//降點用戶記錄

  var UserCenterController = RouterController.extend({

    userList: function() {
      this.changeMainReginView(new UserListView());
    },
    userDetailsView: function(userId) {
      this.changeSubReginView(new UserDetailView({
        userId: userId
      }), {
        parentRouter: 'uc/ul'
      });
    },
    userSecurityView: function(userId) {
      this.changeMainReginView(new UserSecurityView({
        userId: userId
      }), {
        parentRouter: 'uc/ul'
      });
    },
    userBonusView: function(userId) {
      this.changeMainReginView(new UserBonusView({
        userId: userId
      }), {
        parentRouter: 'uc/ul'
      });
    },
    distributorList: function() {
      this.changeMainReginView(new DistributorListView());
    },
    newDistributor: function() {
      this.changeMainReginView(new NewDistributorView());
    },
    disabledUserListView: function() {
      this.changeMainReginView(new DisabledUserListView());
    },
    enabledUserListView: function() {
      this.changeMainReginView(new EnabledUserListView());
    },
    recycleUserListView: function() {
      this.changeMainReginView(new RecycleUserListView());
    },
    resetUserListView: function() {
      this.changeMainReginView(new ResetUserListView());
    },
    quotaManage:function(){
      this.changeMainReginView(new QuotaManageView());
    },
    dropUserListView:function(){
      this.changeMainReginView(new DropUserListView());
    }
  });

  module.exports = UserCenterController;

});