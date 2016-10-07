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
          label: '招商号',
          name: 'zero',
          id: 'jsUCQuotaLevelZeroTab',
          view: QuotaManage_LevelZeroView
        });
        tabs.push({
          label: '直属号',
          name: 'one',
          id: 'jsUCQuotaLevelOneTab',
          view: QuotaManage_LevelOneView
        });
        tabs.push({
          label: '总代',
          name: 'two',
          id: 'jsUCQuotaLevelTwoTab',
          view: QuotaManage_LevelTwoView
        });
        tabs.push({
          label: '平级12.8',
          name: 'three',
          id: 'jsUCQuotaLevelThreeTab',
          view: QuotaManage_LevelThreeView
        });
        tabs.push({
          label: '代理12.7',
          name: 'four',
          id: 'jsUCQuotaLevelFourTab',
          view: QuotaManage_LevelFourView
        });
        tabs.push({
          label: '平级12.7',
          name: 'five',
          id: 'jsUCQuotaLevelFiveTab',
          view: QuotaManage_LevelFiveView
        });
        tabs.push({
          label: '代理12.6',
          name: 'six',
          id: 'jsUCQuotaLevelSixTab',
          view: QuotaManage_LevelSixView
        });
        tabs.push({
          label: '平级12.6',
          name: 'seven',
          id: 'jsUCQuotaLevelSevenTab',
          view: QuotaManage_LevelSevenView
        });
        tabs.push({
          label: '平级配额',
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