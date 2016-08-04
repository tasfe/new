define(function (require, exports, module) {

  require('prefab/views/tabView');


  var RechargeRangeSetMobileView = require('fundCenter/views/recharge-RechargeSet-Range-Mobile');
  //var RechargeReturnFeeSetView = require('fundCenter/views/recharge-RechargeSet-ReturnFee');
  var RechargeQuickAmountSetMobileView = require('fundCenter/views/recharge-RechargeSet-QuickAmount-Mobile');


  var RechargeSetView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rsm.rangeSet){
        tabs.push({
          label: '充值渠道上下限设置',
          name: 'range',
          id: 'jsFCRechargeRangeMobileTab',
          view: RechargeRangeSetMobileView
        });
      }
      if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rsm.quickSet){
        tabs.push({
          label: '快捷金额设置',
          name: 'amount',
          id: 'jsFCRechargeQuickAmountMobileTab',
          view: RechargeQuickAmountSetMobileView
        });
      }
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = RechargeSetView;
});