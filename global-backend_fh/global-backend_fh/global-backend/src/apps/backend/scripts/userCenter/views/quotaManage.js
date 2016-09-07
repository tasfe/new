define(function (require, exports, module) {

  require('prefab/views/tabView');
  var QuotaManage_LevelZeroView = require('userCenter/views/quotaManage-levelZero');
  var QuotaManage_LevelOneView = require('userCenter/views/quotaManage-levelOne');
  var QuotaManage_LevelTwoView = require('userCenter/views/quotaManage-levelTwo');
  var QuotaManage_LevelThreeView = require('userCenter/views/quotaManage-levelThree');
  var QuotaManage_LevelFourView = require('userCenter/views/quotaManage-levelFour');
  var QuotaManage_LevelFiveView = require('userCenter/views/quotaManage-levelFive');
  var QuotaManage_LevelSixView = require('userCenter/views/quotaManage-levelSix');
  var QuotaManage_LevelSevenView = require('userCenter/views/quotaManage-levelSeven');
  var QuotaManage_LevelEightView = require('userCenter/views/quotaManage-levelEight');
  var QuotaManage_LevelNineView = require('userCenter/views/quotaManage-levelNine');
  var QuotaManage_LevelTenView = require('userCenter/views/quotaManage-levelTen');
  var QuotaManage_OpenView = require('userCenter/views/quotaManage-openSet');

  var QuotaManageView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
        tabs.push({
          label: '直属13.0',
          name: 'zero',
          id: 'jsUCQuotaLevelZeroTab',
          view: QuotaManage_LevelZeroView
        });
        tabs.push({
          label: '平级13.0',
          name: 'one',
          id: 'jsUCQuotaLevelOneTab',
          view: QuotaManage_LevelOneView
        });
        tabs.push({
          label: '返点12.9',
          name: 'two',
          id: 'jsUCQuotaLevelTwoTab',
          view: QuotaManage_LevelTwoView
        });
        tabs.push({
          label: '平级12.9',
          name: 'three',
          id: 'jsUCQuotaLevelThreeTab',
          view: QuotaManage_LevelThreeView
        });
        tabs.push({
          label: '返点12.8',
          name: 'four',
          id: 'jsUCQuotaLevelFourTab',
          view: QuotaManage_LevelFourView
        });
        tabs.push({
          label: '平级12.8',
          name: 'five',
          id: 'jsUCQuotaLevelFiveTab',
          view: QuotaManage_LevelFiveView
        });
        tabs.push({
          label: '返点12.7',
          name: 'six',
          id: 'jsUCQuotaLevelSixTab',
          view: QuotaManage_LevelSixView
        });
        tabs.push({
          label: '平级12.7',
          name: 'seven',
          id: 'jsUCQuotaLevelSevenTab',
          view: QuotaManage_LevelSevenView
        });
        tabs.push({
          label: '返点12.6',
          name: 'eight',
          id: 'jsUCQuotaLevelEightTab',
          view: QuotaManage_LevelEightView
        });
        tabs.push({
          label: '平级12.6',
          name: 'nine',
          id: 'jsUCQuotaLevelNineTab',
          view: QuotaManage_LevelNineView
        });
        tabs.push({
          label: '返点12.5',
          name: 'ten',
          id: 'jsUCQuotaLevelTenTab',
          view: QuotaManage_LevelTenView
        });
        tabs.push({
          label: '平级开关',
          name: 'open',
          id: 'jsUCQuotaOpenTab',
          view: QuotaManage_OpenView
        });
      _(this.options).extend({
        tabs: tabs
      });
    }

  });

  module.exports = QuotaManageView;
});