define(function (require, exports, module) {
  require('prefab/views/tabView');

  var ListMobileView = require('./list-Mobile');

  var RechargeMobileView = Base.Prefab.TabView.extend({

    initialize: function () {
      _(this.options).extend({
        tabs: [
          {
            label: '银联支付',
            name: 'jsUnionMobile',
            id: 'jsUnionMobileTab',
            view: ListMobileView,
            options: {
              paymentType: 1,
              type:1
            }
          },
          {
            label: '支付宝',
            name: 'jsAliMobilePay',
            id: 'jsAliPayMobileTab',
            view: ListMobileView,
            options: {
              paymentType: 2,
              type:1
            }
          },
          {
            label: '微信',
            name: 'jsWechatMobile',
            id: 'jsWechatMobileTab',
            view: ListMobileView,
            options: {
              paymentType: 3,
              type:1
            }
          }
        ]
      });
    }

  });

  module.exports = RechargeMobileView;
});