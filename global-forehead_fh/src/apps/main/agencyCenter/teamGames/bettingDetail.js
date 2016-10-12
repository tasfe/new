"use strict";

var BettingDetailView = require('userCenter/bettingDetail');

var LowLevelBettingDetailView = BettingDetailView.extend({

  initialize: function(options) {
    BettingDetailView.prototype.initialize.apply(this, arguments);

    this.options.detailPrevUrl = '#ac/tr/' + this.options.userId + '/detail/';
  },

  onRender: function() {
    BettingDetailView.prototype.onRender.apply(this, arguments);

    this.$('.js-bd-title').html('查看' + _.getUrlParam('name') + '的投注详情');
  }
});

module.exports = LowLevelBettingDetailView;
