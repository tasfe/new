//中间者启动必要文件,用于配置权限等

define(function(require, exports, module) {

  var MediatorModule = Base.Module.extend({

    startWithParent: false,

    initialize: function() {
      Base.SubscribePermissions.init({
        'notice:updating': {
          notice: true
        },
        'acct:updating': {
          acct: true
        }
      });

      _(this).extend(Base.MediatorFacade);
    }

  });

  module.exports = MediatorModule;
});
