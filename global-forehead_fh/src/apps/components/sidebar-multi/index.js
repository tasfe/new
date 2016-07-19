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
      alwaysVisible: true
    });
  },

  goTo: function(page, type) {
    this.$('[data-args="' + page + '"]').trigger('click', type);
  },

  toggleVisible: function(id) {
    var $items = this.$el.find('.js-com-multi-item');
    $items.addClass('hidden');
    $items.filter('[data-parent-id="' + id + '"]').removeClass('hidden');
  },

  multiItemSelectHandler: function(e, type) {
    var $target = $(e.currentTarget);

    this.trigger('change:select', $target.data('args'), type === 'goTo' ? '' : $target.attr('href'), $target.data('parentId'));

    return false;
  }
});

module.exports = MultiSidebarView;
