/**
 * Created by David Zhang on 2015/9/9.
 */

define(function (require, exports, module) {

  require('prefab/views/tabView');

  var CommonSetView = require('betCenter/views/species-TicketList-commonRuleSet');
  var CloseSetView = require('betCenter/views/species-TicketList-closeSet');
  var PlanDetailView =  require('betCenter/views/species-TicketList-planDetail');
  var RiskControlView = require('betCenter/riskControl/index');

  var TicketPlanRuleSetView = Base.Prefab.TabView.extend({

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
      var tabs = [];
      if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.commonRule){
        tabs.push({
          label: '常用规则',
          name: 'commonRule',
          id: 'jsPlanRulesTab',
          view:  CommonSetView
        });
      }
      if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.closeSet){
        tabs.push({
          label: '休市维护',
          name: 'closeSet',
          id: 'jsCloseSetTab',
          view:  CloseSetView
        });
      }
      if(Global.authority.bc && Global.authority.bc.tl && Global.authority.bc.tl.planDetail){
        tabs.push({
          label: '详细奖期',
          name: 'palnDetail',
          id: 'jsPalnDetailTab',
          view:  PlanDetailView
        });
      }
      if(Global.memoryCache.get('acctInfo').groupId === 5
        && _([10, 12, 13, 14, 15, 16, 17,19,20,26,28]).contains(Nmber(this.options.ticketId))) {
        tabs.push({
          label: '风险控制',
          name: 'riskControl',
          id: 'jsRiskControlTab',
          view:  RiskControlView
        });
      }


      _(this.options).extend({
        tabs: tabs
      });
    }
  });

  module.exports = TicketPlanRuleSetView;
});