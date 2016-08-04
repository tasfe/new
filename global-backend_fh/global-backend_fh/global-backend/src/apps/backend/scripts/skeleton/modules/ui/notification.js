define(function(require, exports, module) {

  var NotificationModule = Base.Module.extend({

    startWithParent: false,

    initialize: function(options, moduleName, app) {
      $.jGrowl.defaults.pool = 5;
      $.fn.jGrowl.prototype.defaults.closerTemplate = '<div>[ 关闭所有 ]</div>';
    },

    // options 参考: https://github.com/stanlemon/jGrowl
    show: function(content, options) {

      var settings = _.extend({
        group: 'alert-info', // alert-success|alert-info|alert-warning|alert-danger
        life: 5000,
        position: 'center'
      }, options || {});
      $.jGrowl(content, settings);
    },

    closeAll: function() {
      $('body').find('.jGrowl-notification').trigger('jGrowl.close');
    }

  });

  module.exports = NotificationModule;

});