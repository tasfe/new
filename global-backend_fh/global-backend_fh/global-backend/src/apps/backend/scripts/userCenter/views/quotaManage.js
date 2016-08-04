define(function (require, exports, module) {

  require('prefab/views/tabView');
  var QuotaManage_LevelZeroView = require('userCenter/views/quotaManage-levelZero');
  var QuotaManage_LevelOneView = require('userCenter/views/quotaManage-levelOne');
  var QuotaManage_LevelTwoView = require('userCenter/views/quotaManage-levelTwo');
  var QuotaManage_LevelThreeView = require('userCenter/views/quotaManage-levelThree');
  var QuotaManage_LevelFourView = require('userCenter/views/quotaManage-levelFour');

  var QuotaManageView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.rangeSet){
        tabs.push({
          label: '直属13.0',
          name: 'zero',
          id: 'jsUCQuotaLevelZeroTab',
          view: QuotaManage_LevelZeroView
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.rangeSet){
      tabs.push({
        label: '平级13.0',
        name: 'one',
        id: 'jsUCQuotaLevelOneTab',
        view: QuotaManage_LevelOneView
      });
      //}
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.returnFeeSet){
        tabs.push({
          label: '返点12.8',
          name: 'two',
          id: 'jsUCQuotaLevelTwoTab',
          view: QuotaManage_LevelTwoView
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.returnFeeSet){
        tabs.push({
          label: '返点12.7',
          name: 'three',
          id: 'jsUCQuotaLevelThreeTab',
          view: QuotaManage_LevelThreeView
        });
      //}
      //if(Global.authority.fc && Global.authority.fc.rs && Global.authority.fc.rs.returnFeeSet){
        tabs.push({
          label: '返点12.6',
          name: 'four',
          id: 'jsUCQuotaLevelFourTab',
          view: QuotaManage_LevelFourView
        });
      //}
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = QuotaManageView;
});