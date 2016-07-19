"use strict";

//中间者启动必要文件,用于配置权限等

var MediatorModule = Base.Module.extend({

  startWithParent: false,

  initialize: function() {
    Base.SubscribePermissions.init({
      'news:updating': {
        news: true
      },
      'message:updating': {
        message: true
      },
      'acct:updating': {
        acct: true
      }
    });

    _(this).extend(Base.MediatorFacade);
  }

});

module.exports = MediatorModule;
