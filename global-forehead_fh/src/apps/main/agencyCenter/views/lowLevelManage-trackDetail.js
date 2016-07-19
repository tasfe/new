"use strict";

var TrackDetailView = require('userCenter/views/trackDetail');

var LowLevelTrackDetailView = TrackDetailView.extend({

  initialize: function(options) {
    TrackDetailView.prototype.initialize.apply(this, arguments);

    this.options.detailPrevUrl = '#ac/betting/' + this.options.userId + '/detail/';
  },

  onRender: function() {
    TrackDetailView.prototype.onRender.apply(this, arguments);

    this.$('.js-td-title').html('查看' + _.getUrlParam('name') + '的追号详情');
  }
});

module.exports = LowLevelTrackDetailView;
