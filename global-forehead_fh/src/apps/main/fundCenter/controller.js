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
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  accountDetails: function() {
    this.changeMainReginView(new MoneyDetailsView(), {
      main: {
        title: '账户明细'
      },
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  }
});

module.exports = FundCenterController;
