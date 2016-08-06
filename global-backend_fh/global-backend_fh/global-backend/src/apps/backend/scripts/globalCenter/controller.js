define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var RegisterAndLoginSetView = require('globalCenter/views/registerAndLoginSet');

  var SensitiveWordManageView = require('globalCenter/views/sensitiveWordManage');

  var BlackListOfIPManageView = require('globalCenter/views/blackListOfIPManage');

  var GlobalCenterController = RouterController.extend({

    registerAndLogin: function() {
      this.changeMainReginView(new RegisterAndLoginSetView());
    },

    sensitiveWord: function() {
      this.changeMainReginView(new SensitiveWordManageView());
    },
    blackListOfIP: function() {
      this.changeMainReginView(new BlackListOfIPManageView());
    }

  });

  module.exports = GlobalCenterController;

});