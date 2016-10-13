define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var BulletinManageView = require('messageCenter/views/bulletin-BulletinManage');//�������;
  var NewBulletinView = require('messageCenter/views/bulletin-NewBulletin');//�½�����
  var LetterManegeView = require('messageCenter/views/letter-LetterManage');//վ���Ź���
  var SubscribeManageView = require('messageCenter/views/notice-SubscribeManage');//�˶��û�����
  var NoticeSettingView = require('messageCenter/views/notice-NoticeSetting');//ϵͳ֪ͨ����
  var NoticeManageView = require('messageCenter/views/notice-NoticeManage');//ϵͳ֪ͨ����
  var NewNoticeView = require('messageCenter/views/notice-NewNotice');//�½�ϵͳ֪ͨ

  var UserFeedbackList = require('messageCenter/views/userFeedbackList');

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
    },
    userFeedbackView: function() {
      this.changeMainReginView(new UserFeedbackList());
    }
  });

  module.exports = MessageCenterController;

});