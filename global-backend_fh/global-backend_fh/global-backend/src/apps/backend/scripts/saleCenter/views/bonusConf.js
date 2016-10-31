define(function (require, exports, module) {

  require('prefab/views/tabView');
  var bonusManager_mansger = require('saleCenter/views/bonusManager-manager');
  var bonusManager_gold = require('saleCenter/views/bonusManager-gold');

  var BonusManageView = Base.Prefab.TabView.extend({

    events: {},

    initialize: function () {
      var tabs = [];
      tabs.push({
        label: '招商号私返',
        name: 'manager',
        id: 'bonusManagerMngTab',
        view: bonusManager_mansger
      });
      tabs.push({
        label: '直属号私返',
        name: 'gold',
        id: 'bonusManagerGoldTab',
        view: bonusManager_gold
      });
      _(this.options).extend({
        tabs: tabs
      });
    }
  });

  module.exports = BonusManageView;
});