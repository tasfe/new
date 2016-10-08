"use strict";

var PriceDetailsView = require('userCenter/views/priceDetails');

var OnlineRechargeView = PriceDetailsView.extend({

  initialize: function() {
    PriceDetailsView.prototype.initialize.apply(this, arguments);
  }
});

module.exports = OnlineRechargeView;
