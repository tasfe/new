var MoneyTransferView = require('fundCenter/views/moneyTransfer');

var LowLevelMoneyTransferView = MoneyTransferView.extend({

  initialize: function(options) {
    MoneyTransferView.prototype.initialize.apply(this, arguments);

    _(this.options).extend({
      reqData: {
        userId: options.userId,
        username: _.getUrlParam('name')
      }
    });

    //this.template = '<div class="clearfix">' +
    //  '<button class="btn btn-sm btn-inverse pull-right sub-return" type="button">返回</button>' +
    //  '<label>给' + _.getUrlParam('name') + '转账</label></div><hr />' +
    //  this.template;
  }
});

module.exports = LowLevelMoneyTransferView;
