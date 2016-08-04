define(function (require, exports, module) {
  require('prefab/views/tabView');

  var ListView = require('./list');

  var RechargeView = Base.Prefab.TabView.extend({

    initialize: function () {
      _(this.options).extend({
        tabs: [
          {
            label: '银联支付',
            name: 'jsUnion',
            id: 'jsUnionTab',
            view: ListView,
            options: {
              paymentType: 1,
              type:0
            }
          },
          {
            label: '支付宝',
            name: 'jsAliPay',
            id: 'jsAliPayTab',
            view: ListView,
            options: {
              paymentType: 2,
              type:0
            }
          },
          {
            label: '微信',
            name: 'jsWechat',
            id: 'jsWechatTab',
            view: ListView,
            options: {
              paymentType: 3,
              type:0
            }
          },
          {
            label: '支付宝转账',
            name: 'jsAliRecharge',
            id: 'jsAliRechargeTab',
            view: ListView,
            options: {
              paymentType: 4,
              type:0

            }
          },
          {
            label: '微信转账',
            name: 'jsWechatRecharge',
            id: 'jsWechatRechargeTab',
            view: ListView,
            options: {
              paymentType: 5,
              type:0
            }
          }
        ]
      });
    }

  });

  module.exports = RechargeView;
});