"use strict";

var TabView = require('com/tabView');

var PersonalView = require('./moneyDetail');

var RechargeView = require('./rechargeRecords');
var WithdrawView = require('./withdrawRecords');

var MoneyDetailView = TabView.extend({

  //template: require('fundCenter/templates/moneyDetails.html'),
  //
  //events: {},

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '充值记录',
          name: 'recharge',
          id: 'jsRecharge',
          view: RechargeView
        }, {
          label: '提现记录',
          name: 'withdraw',
          id: 'jsWithdraw',
          view: WithdrawView
        }, {
          label: '账变明细',
          name: 'moneydetail',
          id: 'jsMoneyDetail',
          view: PersonalView
        }
      ]
    });
  }
});

module.exports = MoneyDetailView;