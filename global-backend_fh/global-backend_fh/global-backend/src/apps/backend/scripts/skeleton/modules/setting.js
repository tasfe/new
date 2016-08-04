define(function(require, exports, module) {

  var SettingModule = Base.Module.extend({

    startWithParent: false,

    initialize: function() {
      ParsleyConfig.errorsWrapper = '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>';
      ParsleyConfig.errorTemplate =  '<div class="tooltip-inner">';
      ParsleyConfig.trigger = 'change';
    }
  });

  module.exports = SettingModule;

});