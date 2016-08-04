define(function (require, exports, module) {
  require('prefab/views/tabView');

  var RechargeBankView = require('fundCenter/views/bank-BankManagement-Recharge');
  var WithdrawBankView = require('fundCenter/views/bank-BankManagement-Withdraw');

  var BankManagementView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.reBank){
        tabs.push({
          label: '充值银行',
          name: 'recharge',
          id: 'jsFCBankRechargeTab',
          view: RechargeBankView
        });
      }
      if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.wiBank){
        tabs.push({
          label: '绑定/提现银行',
          name: 'withdraw',
          id: 'jsFCBankWithdrawTab',
          view: WithdrawBankView
        });
      }
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = BankManagementView;
});