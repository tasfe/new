define(function(require, exports, module) {

  var UIModule = Base.Module.extend({

    startWithParent: false,

    initialize: function(options, moduleName, app) {
      this._initPortletCollapse();
    },

    _initPortletCollapse: function() {
      var $activeWidget = '';
      $('body').on('click', '.portlet-collapse-option', function() {
        var $activeWidget = $(this).parent().parent().parent();

        $activeWidget.find('.portlet-inner').slideToggle();
        $activeWidget.toggleClass('portlet-collapsed');

        var $activeSpinIcon = $activeWidget.find('.refresh-icon-animated').fadeIn();

        setTimeout(function() {
          $activeSpinIcon.fadeOut();
        }, 500);

        $activeWidget = '';

        return false;
      });
    }

  });

  module.exports = UIModule;

});