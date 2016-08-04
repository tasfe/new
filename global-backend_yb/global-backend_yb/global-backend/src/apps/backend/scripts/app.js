define(function(require, exports, module) {

  var HeaderView = require('skeleton/views/header');
  var SidebarView = require('skeleton/views/sidebar');
  var FooterView = require('skeleton/views/footer');
  var SideMenuCollection = require('skeleton/collections/sideMenu');

  var QuickNavView = require('skeleton/views/quickNav');

  var core = require('com/mathjs/math');

  window.math = core.create();

  var App = new window.Base.Application();

  App.on('start', function() {
    _.delay(function() {
      $('body').addClass('loaded').find('.wm-loader-wrapper').remove();
      $('.wrapper.wt-wrapper').removeClass('hide');
    }, 50);
  });

  App.addRegions({
    headerRegion: '#header',
    sidebarRegin: '#sidebar',
    mainRegin: '#main',
    navRegin: '#quickNav',
    footerRegin: '#footer'
  });

  App.addInitializer(function(options) {

    App.headerRegion.show(new HeaderView());
    App.footerRegin.show(new FooterView());

    var sideMenuCollection = new SideMenuCollection();
    App.sidebarRegin.show(new SidebarView({
      collection: sideMenuCollection
    }));

    App.navRegin.show(new QuickNavView());

    //  Backbone.history.start();

    sideMenuCollection.fetch({
      type: 'post',
      silent: true
    }).done(function() {
      Backbone.history.start();
    }).fail(function() {
      window.Global.ui.notification.show('服务器异常 请稍后再试', {
        group: 'alert-danger',
        sticky: true
      });
    });

    _bindClosePopoverHandler();
  });


  function _bindClosePopoverHandler() {
    $(document).off('click.popover').on('click.popover', function(e) {
      var $target = $(e.target);
      var $popover = $target.closest('.popover');
      if (!$popover.length) {
        _($(':data(popover)')).each(function(el) {
          var $el = $(el);
          if ($el.data('popover') !== $target.data('popover') &&
            $el.data('popover') && $el.data('popover').$tip && $el.data('popover').$tip.hasClass('in')) {
            $el.popover('hide');
          }
        });
      }
    });
  }

  module.exports = App;

});