define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var BulletinManageView = require('messageCenter/views/bulletin-BulletinManage');//公告管理;
  var NewBulletinView = require('messageCenter/views/bulletin-NewBulletin');//新建公告
  var LetterManegeView = require('messageCenter/views/letter-LetterManage');//站内信管理
  var SubscribeManageView = require('messageCenter/views/notice-SubscribeManage');//退订用户管理
  var NoticeSettingView = require('messageCenter/views/notice-NoticeSetting');//系统通知设置
  var NoticeManageView = require('messageCenter/views/notice-NoticeManage');//系统通知管理
  var NewNoticeView = require('messageCenter/views/notice-NewNotice');//新建系统通知

  var MessageCenterController = RouterController.extend({

    bulletinManageView: function() {
      this.changeMainReginView(new BulletinManageView());
    },
    newBulletinView: function() {
      this.changeMainReginView(new NewBulletinView());
    },
    letterManegeView: function() {
      this.changeMainReginView(new LetterManegeView());
    },
    subscribeManageView: function() {
      this.changeMainReginView(new SubscribeManageView());
    },
    noticeSettingView: function() {
      this.changeMainReginView(new NoticeSettingView());
    },
    noticeManageView: function() {
      this.changeMainReginView(new NoticeManageView());
    },
    newNoticeViewView: function() {
      this.changeMainReginView(new NewNoticeView());
    }
  });

  module.exports = MessageCenterController;

});