define(function (require, exports, module) {
  require('./bankList-tab');

  var ListView = require('./bankList');

  var RechargeView = Base.Prefab.TabView.extend({

    initialize: function () {
      _(this.options).extend({
        tabs: [
          {
            label: '银联支付一',
            name: 'jsUnionOne',
            id: 'jsUnionOneTab',
            view: ListView,
            options: {
              paymentType: 1
            }
          },
          {
            label: '银联支付二',
            name: 'jsUnionTwo',
            id: 'jsUnionTwoTab',
            view: ListView,
            options: {
              paymentType: 4
            }
          },
          {
            label: '银联支付三',
            name: 'jsUnionThree',
            id: 'jsUnionThreeTab',
            view: ListView,
            options: {
              paymentType: 5
            }
          },
          {
            label: '支付宝扫码支付',
            name: 'jsAliPayOne',
            id: 'jsAliPayOneTab',
            view: ListView,
            options: {
              paymentType: 2
            }
          },
          {
            label: '支付宝支付',
            name: 'jsAliPay',
            id: 'jsAliPayTab',
            view: ListView,
            options: {
              paymentType: 6
            }
          },
          {
            label: '微信小额支付',
            name: 'jsWechatOne',
            id: 'jsWechatOneTab',
            view: ListView,
            options: {
              paymentType: 3
            }
          },
          {
            label: '微信大额支付',
            name: 'jsWechatTwo',
            id: 'jsWechatTwoTab',
            view: ListView,
            options: {
              paymentType: 7
            }
          },
          {
            label: '信用卡支付',
            name: 'jsCardPay',
            id: 'jsCardPayTab',
            view: ListView,
            options: {
              paymentType: 8
            }
          }
        ]
      });
    }

  });

  module.exports = RechargeView;
});