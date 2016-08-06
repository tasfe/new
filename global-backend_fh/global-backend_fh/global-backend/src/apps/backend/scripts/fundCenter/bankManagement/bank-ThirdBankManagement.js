define(function (require, exports, module) {
  require('prefab/views/tabView');

  var ConfigView = require('./config');

  var BankManagementView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      //if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.reBank){
        tabs.push({
          label: '聚宝云',
          name: 'jvbao',
          id: 'jsFCJvbaoTab',
          view: ConfigView,
          options: {
            platformId: 2
          }
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.wiBank){
        tabs.push({
          label: '宝付',
          name: 'baofoo',
          id: 'jsFCBaofooTab',
          view: ConfigView,
          options: {
            platformId: 1
          }
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.wiBank){
        tabs.push({
          label: '易宝',
          name: 'yeepay',
          id: 'jsFCYeepayTab',
          view: ConfigView,
          options: {
            platformId: 3
          }
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.wiBank){
        tabs.push({
          label: '魔宝',
          name: 'mobao',
          id: 'jsFCMobaoTab',
          view: ConfigView,
          options: {
            platformId: 4
          }
        });
      //}
      tabs.push({
        label: '通汇卡',
        name: 'tongHui',
        id: 'jsFCTongHuiTab',
        view: ConfigView,
        options: {
          platformId: 5
        }
      });

      tabs.push({
        label: '易优付',
        name: 'yiYouFu',
        id: 'jsFCYiYouFuTab',
        view: ConfigView,
        options: {
          platformId: 6
        }
      });

      tabs.push({
        label: '智付',
        name: 'zhiFu',
        id: 'jsFCZhiFuTab',
        view: ConfigView,
        options: {
          platformId: 7
        }
      });

      tabs.push({
        label: '国付宝',
        name: 'guoFu',
        id: 'jsFCGuoFuTab',
        view: ConfigView,
        options: {
          platformId: 8
        }
      });

      tabs.push({
        label: '盈宝',
        name: 'eyPal',
        id: 'jsFCEyPalTab',
        view: ConfigView,
        options: {
          platformId: 10
        }
      });

      tabs.push({
        label: '新生',
        name: 'newPay',
        id: 'jsFCNewPayTab',
        view: ConfigView,
        options: {
          platformId: 11
        }
      });

      tabs.push({
        label: '优付',
        name: 'yomPay',
        id: 'jsFCYomPayTab',
        view: ConfigView,
        options: {
          platformId: 12
        }
      });

      tabs.push({
        label: '威富通',
        name: 'swiftPass',
        id: 'jsSwiftPassPayTab',
        view: ConfigView,
        options: {
          platformId: 13
        }
      });

      tabs.push({
        label: '汇潮',
        name: 'ecpss',
        id: 'jsEcpssPayTab',
        view: ConfigView,
        options: {
          platformId: 14
        }
      });

      tabs.push({
        label: '快捷通',
        name: 'kjtPay',
        id: 'jsKjtPayTab',
        view: ConfigView,
        options: {
          platformId: 15
        }
      });

      tabs.push({
        label: '6付',
        name: '6Pay',
        id: 'js6PayTab',
        view: ConfigView,
        options: {
          platformId: 16
        }
      });

      tabs.push({
        label: '银盛',
        name: 'ysPay',
        id: 'jsYsPayTab',
        view: ConfigView,
        options: {
          platformId: 17
        }
      });

      tabs.push({
        label: '易汇金',
        name: 'yhjPay',
        id: 'jsYhjPayTab',
        view: ConfigView,
        options: {
          platformId: 18
        }
      });

      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = BankManagementView;
});