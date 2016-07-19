/**
 * Created by ABCD on 2015/10/23.
 */
var BettingDetailView = require('userCenter/views/bettingDetail');

var BettingCenterBettingDetailView = BettingDetailView.extend({

  initialize: function(options) {
    BettingDetailView.prototype.initialize.apply(this, arguments);
    _(this.options).extend({
      tradeNo:options.tradeNo
    });
  },

  onRender: function() {
    BettingDetailView.prototype.onRender.apply(this, arguments);
    //this.$('.js-bd-title').html('查看' + _.getUrlParam('name') + '的投注详情');
  }
});

module.exports = BettingCenterBettingDetailView;
