define(function(require, exports, module) {

  var MessageCenterController = require('messageCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new MessageCenterController(), {
      'mc/nm': 'bulletinManageView',
      'mc/cn': 'newBulletinView',
      'mc/il':'letterManegeView',
      'mc/pu':'subscribeManageView',
      'mc/pt':'noticeSettingView',
      'mc/pm':'noticeManageView',
      'mc/sp':'newNoticeViewView',
      'mc/uf':'userFeedbackView'
    });

  };

});