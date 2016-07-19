"use strict";

var LoaderModule = Base.Module.extend({

  startWithParent: false,

  template: _(require('./index.html')).template(),

  initialize: function(options, moduleName, app) {
    if ($('.wt-wrapper>.loader').size() === 0) {
      $('.wt-wrapper').append($(this.template({})).addClass('hidden'));
    }
  },

  show: function() {
    $('.wt-wrapper>.loader').removeClass('hidden');
  },

  hide: function() {
    $('.wt-wrapper>.loader').addClass('hidden');
  },

  get: function(options) {
    options = _(options || {}).defaults({
      wrapperClass: ''
    });
    return this.template(options);
  }

});

module.exports = LoaderModule;
