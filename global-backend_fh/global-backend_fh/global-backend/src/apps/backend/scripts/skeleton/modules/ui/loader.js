define(function(require, exports, module) {

  var html = '<div class="loader spinner4">' +
    '<div class="dot1"></div>' +
    '<div class="dot2"></div>' +
    '<div class="bounce1"></div>' +
    '<div class="bounce2"></div>' +
    '<div class="bounce3"></div>' +
    '</div>';

  var LoaderModule = Base.Module.extend({

    startWithParent: false,

    initialize: function(options, moduleName, app) {
      if ($('.wt-wrapper>.loader').size() === 0) {
        $('.wt-wrapper').append($(html).addClass('hidden'));
      }
    },

    show: function() {
      $('.wt-wrapper>.loader').removeClass('hidden');
    },

    hide: function() {
      $('.wt-wrapper>.loader').addClass('hidden');
    },

    getHtml: function() {
      return html;
    }

  });

  module.exports = LoaderModule;

});