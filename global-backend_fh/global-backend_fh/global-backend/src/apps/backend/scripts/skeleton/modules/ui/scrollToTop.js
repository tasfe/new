define(function(require, exports, module) {

  var ScrollToTopModule = Base.Module.extend({

    startWithParent: false,

    initialize: function(options, moduleName, app) {

      if ($('body>.wt-scroll-to-top').size() > 0) {
        return;
      }

      var html = '<a href="#" class="wt-scroll-to-top hidden-print">' +
        '<i class="fa fa-chevron-up fa-lg"></i>' +
        '</a>';

      $('body').append(html);

      $('.wt-scroll-to-top').unbind('click').bind('click', function(e) {

        $('html, body').animate({
          scrollTop: 0
        }, 600);
        return false;

      });

      this.enable();

    },

    disable: function() {
      $(window).unbind('scroll.scrollToTop');
    },

    enable: function() {
      $(window).unbind('scroll.scrollToTop').bind('scroll.scrollToTop', function(e) {
        var position = $(window).scrollTop();
        if (position >= 200) {
          $('.wt-scroll-to-top').addClass('active');
        } else {
          $('.wt-scroll-to-top').removeClass('active');
        }
      });
    }

  });

  module.exports = ScrollToTopModule;

});