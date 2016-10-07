"use strict";

require('./index.scss');

var NavbarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-nav-toggle': 'navToggleHandler'
  },

  onRender: function() {
    this.$navToggle = this.$('.js-nav-toggle');
    this.$nav = this.$('.js-nav-container-inner');
  },

  //event handlers

  navToggleHandler: function (e) {
    var $icon = this.$navToggle.find('i');
    var flag = $icon.hasClass('fa-chevron-up');

    $icon.toggleClass('fa-chevron-up', !flag)
      .toggleClass('fa-chevron-down', flag);

    this.$nav.css({overflow: flag ? 'hidden' : ''})
      .animate({
        height: flag ? 0 : 104
      }, 600);
  }

});

module.exports = NavbarView;
