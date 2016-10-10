"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var MoneyTransferView = require('fundCenter/views/moneyTransfer');

var MoneyDetailsView = require('fundCenter/views/moneyDetail-team');

var FundCenterController = RouterController.extend({

  platformTransfer: function() {
    this.changeMainReginView(new MoneyTransferView(), {
      main: {
        title: '平台转账'
      },
      sidebar: Global.ui.menu.get('fc')
    });
  },

  accountDetails: function() {
    this.changeMainReginView(new MoneyDetailsView(), {
      main: {
        title: '账户明细'
      },
      sidebar: 'uc'
    });
  }
});

module.exports = FundCenterController;
