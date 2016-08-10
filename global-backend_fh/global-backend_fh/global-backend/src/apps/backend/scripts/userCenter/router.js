define(function(require, exports, module) {

  var UserCenterController = require('userCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new UserCenterController(), {
      'uc/ul': 'userList',//???????
      'uc/ul/detail/:userId': 'userDetailsView', //?????????
      'uc/ul/security/:userId': 'userSecurityView', //????????????
      'uc/ul/bonus/:userId': 'userBonusView', //?????????????

      'uc/gm': 'distributorList',//???????
      'uc/go': 'newDistributor',//???????
      'uc/fu': 'disabledUserListView',//??????????
      'uc/tu': 'enabledUserListView',//????????
      'uc/ru': 'recycleUserListView',//??????????
      'uc/cu': 'resetUserListView',//??????????
      'uc/qm': 'quotaManage'


    });

  };

});