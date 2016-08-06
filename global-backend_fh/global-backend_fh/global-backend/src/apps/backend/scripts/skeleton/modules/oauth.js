define(function(require, exports, module) {

  var OAuthModule = Base.Module.extend({

    startWithParent: false,

    check: function() {
      return Global.sync.ajax({
        url: '/intra/superlogin/doauth.json'
      });
    },

    logout: function() {
      return Global.sync.ajax({
        url: '/intra/superlogin/dologout.json'
      });
    }
  });

  module.exports = OAuthModule;

});