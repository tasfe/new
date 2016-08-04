define(function (require, exports, module) {

  require('prefab/views/tabView');


  var RechargeRangeSetView = require('fundCenter/views/recharge-RechargeSet-Range');
  //var RechargeReturnFeeSetView = require('fundCenter/views/recharge-RechargeSet-ReturnFee');
  var RechargeQuickAmountSetView = require('fundCenter/views/recharge-RechargeSet-QuickAmount');


  var RechargeSetView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.rangeSet){
        tabs.push({
          label: '充值渠道上下限设置',
          name: 'range',
          id: 'jsFCRechargeRangeTab',
          view: RechargeRangeSetView
        });
      }
     /* if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.returnFeeSet){
        tabs.push({
          label: '充值返还手续费设置',
          name: 'fee',
          id: 'jsFCRechargeReturnFeeTab',
          view: RechargeReturnFeeSetView
        });
      }*/
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.quickSet){
        tabs.push({
          label: '快捷金额设置',
          name: 'amount',
          id: 'jsFCRechargeQuickAmountTab',
          view: RechargeQuickAmountSetView
        });
    // }
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = RechargeSetView;
});