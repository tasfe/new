define(function(require, exports, module) {

  var AuthorityCenterController = require('authorityCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new AuthorityCenterController(), {
      'am/gm': 'authorizationGroupsManage',
      'am/gm/view': 'viewAuthorizationGroup',
      'am/gm/update': 'updateAuthorizationGroup',
      'am/gm/add': 'addAuthorizationGroup',
      'am/cg': 'createAuthorizationGroup',
      'am/um': 'userManagement',
      'am/cu': 'createUser',
      'am/ol': 'operateLogs',
      'am/up': 'updatePassword'

    });

  };

});