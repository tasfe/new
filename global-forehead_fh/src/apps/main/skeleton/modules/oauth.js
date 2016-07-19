"use strict";

var OAuthModule = Base.Module.extend({

  startWithParent: false,

  check: function(options) {
    return Global.sync.ajax(_({
      url: '/acct/login/doauth.json'
    }).defaults(options));
  },

  logout: function() {
    return Global.sync.ajax({
      url: '/acct/login/dologout.json'
    });
  }
});

module.exports = OAuthModule;
