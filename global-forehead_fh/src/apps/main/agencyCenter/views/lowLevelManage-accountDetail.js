var MoneyDetailsView = require('fundCenter/views/moneyDetails');

var LowLevelMoneyDetailsView = MoneyDetailsView.extend({

  initialize: function(options) {
    MoneyDetailsView.prototype.initialize.apply(this, arguments);

    this.options.betDetailPrevUrl = '#ac/betting/' + this.options.userId + '/detail/';
    this.options.chaseDetailPrevUrl = '#ac/track/' + this.options.userId + '/detail/';

    _(this.options).extend({
      reqData: {
        userId: options.userId,
        username: _.getUrlParam('name')
      }
    });
  }
});

module.exports = LowLevelMoneyDetailsView;
