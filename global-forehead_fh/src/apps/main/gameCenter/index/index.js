"use strict";

require('./index.scss');

var GameCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {

  },

  onRender: function() {
    var self = this;
  }

});

module.exports = GameCenterView;
