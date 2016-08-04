define(function (require, exports, module) {

  require('prefab/views/tabView');

  var WithdrawAbnormalSetView = require('fundCenter/views/withdraw-WithdrawDepositSet-Abnormal');
  var WithdrawRangeSetView = require('fundCenter/views/withdraw-WithdrawDepositSet-Range');
  var WithdrawRateSetView = require('fundCenter/views/withdraw-WithdrawDepositSet-Rate');

  var WithdrawSetView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      if(Global.authority.fc && Global.authority.fc.wd && Global.authority.fc.wd.rangeSet){
        tabs.push({
          label: '提现上下限设置',
          name: 'range',
          id: 'jsFCWithdrawRangeTab',
          view: WithdrawRangeSetView
        });
      }
      if(Global.authority.fc && Global.authority.fc.wd && Global.authority.fc.wd.rateSet){
        tabs.push({
          label: '不可提现占比设置',
          name: 'rate',
          id: 'jsFCWithdrawRateTab',
          view: WithdrawRateSetView
        });
      }
      if(Global.authority.fc && Global.authority.fc.wd && Global.authority.fc.wd.abnormalSet){
        tabs.push({
          label: '异常提现设置',
          name: 'abnormal',
          id: 'jsFCWithdrawAbnormalTab',
          view: WithdrawAbnormalSetView
        });
      }
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = WithdrawSetView;
});