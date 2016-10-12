define(function (require, exports, module) {

  require('prefab/views/tabView');


  var RechargeRangeSetView = require('fundCenter/views/recharge-RechargeSet-Range');
  //var RechargeReturnFeeSetView = require('fundCenter/views/recharge-RechargeSet-ReturnFee');
  /*var RechargeQuickAmountSetView = require('fundCenter/views/recharge-RechargeSet-QuickAmount');*/


  var RechargeSetView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.rangeSet){
        tabs.push({
          label: '充值处理时间设置',
          name: 'range',
          id: 'jsFCRechargeRangeTab',
          view: RechargeRangeSetView
        });
      }
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = RechargeSetView;
});