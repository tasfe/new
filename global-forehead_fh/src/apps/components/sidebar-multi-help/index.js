"use strict";

var slimscroll = require('jquery-slimscroll');

require('./index.scss');

var MultiSidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-com-multi-item': 'multiItemSelectHandler'
  },

  serializeData: function() {
    var sidebar = _(this.options.sidebar).clone();

    return {
      menus: sidebar
    };
  },

  onRender: function() {
    this.$multiMain = this.$('.js-com-multi-main');

    this.$multiMain.slimScroll({
      height: this.options.height,
      alwaysVisible: false
    });
    this.$('.js-com-multi-item').eq(0).trigger('click');
  },

  goTo: function(page, type) {
    this.$('[data-args="' + page + '"]').trigger('click', type);
  },

  multiItemSelectHandler: function(e, type) {
    var $target = $(e.currentTarget);
    this.$('.js-com-multi-item').removeClass('active');
    $target.addClass('active');

    this.trigger('change:select', $target.data('args'), type === 'goTo' ? '' : $target.attr('href'), $target);

    return false;
  }
});

module.exports = MultiSidebarView;
