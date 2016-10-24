"use strict";

require('./index.scss');

var SidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  initialize: function() {},

  serializeData: function() {
    var sidebar;
    if (_(this.options.sidebar).isArray()) {
      sidebar = _(this.options.sidebar).map(this.formatSidebar.bind(this));
    } else {
      sidebar = [this.formatSidebar(this.options.sidebar)];
    }

    return {
      sidebarList: sidebar
    };
  },

  formatSidebar: function(sidebar) {
    var self = this;
    sidebar = _(sidebar).clone() || {};

    sidebar.sub = _(sidebar.sub).map(function(menu) {
      var isActive = window.location.hash.indexOf(menu.rootRouter || menu.router) !== -1;
      //if (isActive) {
      //  self.trigger('current:menu', {
      //    sidebar: sidebar,
      //    menu: menu
      //  });
      //}
      return _({}).extend(menu, {
        isActive: isActive
      });
    });

    return sidebar;
  }
});

module.exports = SidebarView;
