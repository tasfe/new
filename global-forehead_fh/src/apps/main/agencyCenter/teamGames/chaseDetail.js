"use strict";

var TrackDetailView = require('userCenter/chaseDetail');

var LowLevelTrackDetailView = TrackDetailView.extend({

  initialize: function(options) {
    TrackDetailView.prototype.initialize.apply(this, arguments);

    // this.options.detailPrevUrl = '#tg/br/' + this.options.userId + '/detail/';
    this.options.detailPrevUrl = '#tg/br/detail/';
  },

  onRender: function() {
    TrackDetailView.prototype.onRender.apply(this, arguments);

    this.$('.js-bd-title').html('查看' + _.getUrlParam('name') + '的追号详情');
  }
});

module.exports = LowLevelTrackDetailView;
