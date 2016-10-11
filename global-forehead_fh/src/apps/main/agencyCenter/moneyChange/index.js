"use strict";

var TabView = require('com/tabView');

var MoneyDetailView = require('./moneyDetail-team');
var RechargeRecords = require('./rechargeRecords');
var WithdrawRecords = require('./withdrawRecords');


var MoneyChangeView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '团队帐变',
          name: 'money',
          id: 'jsMoney',
          view: MoneyDetailView
        },
        {
          label: '团队充值记录',
          name: 'recharge',
          id: 'jsRecharge',
          view: RechargeRecords
        },
        {
          label: '团队提现记录',
          name: 'withdraw',
          id: 'jsWithdraw',
          view: WithdrawRecords
        }
      ]
    });
  }
});

module.exports = MoneyChangeView;
