define(function (require, exports, module) {

  require('prefab/views/tabView');
  var bonusManager_mansger = require('saleCenter/views/bonusManager-manager');

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
      _(this.options).extend({
        tabs: tabs
      });
    }
  });

  module.exports = BonusManageView;
});