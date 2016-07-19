"use strict";

var TabView = require('com/tabView');

var ChaseNormalView = require('bettingCenter/views/bettingCenter-chase-normal');
var ChaseProfitView = require('bettingCenter/views/bettingCenter-chase-profit');
var IDsSuper3 = require('bettingCenter/misc/super3k/IDsOfSuper3k');

var BettingChaseView = TabView.extend({

  events: {},

  options: {
    tabClass: 'nav-tabs nav-tabs-border'
  },

  initialize: function () {
    var tabs = [
      {
        label: '普通追号',
        name: 'normal',
        id: 'jsBcChaseNormal',
        view: ChaseNormalView,
        toggleInit: false
      }
    ];

    this.initParams();

    if (this.options.singleType) {
      tabs.push({
        label: '利润追号',
        name: 'profit',
        id: 'jsBcChaseProfit',
        view: ChaseProfitView,
        toggleInit: false
      });
    }

    _(this.options).extend({
      tabs: tabs
    });
  },

  initParams: function() {
    var params = {
      previewList: [],
      singleType: true,
      maxMultiple: 999999,
      basicBettingMoney: 0,
      basicMaxBonus: 0
    };

    var category = {
      playId: [],
      betMethod: [],
      unit: []
    };

    params.previewList = _(this.options.previewList).map(function(previewInfo) {
      var info = _({}).extend(previewInfo);
      info.multiple = 1;

      if (previewInfo.maxMultiple < params.maxMultiple) {
        params.maxMultiple = previewInfo.maxMultiple;
      }

      params.prefabMoney = _(previewInfo.prefabMoney).div(previewInfo.multiple);

      params.basicBettingMoney = _(params.basicBettingMoney).add(params.prefabMoney);
      params.basicMaxBonus = _(params.basicMaxBonus).add(_(previewInfo.formatMaxBonus).div(previewInfo.multiple));

      category.playId.push(previewInfo.playId);
      category.betMethod.push(previewInfo.betMethod);
      category.unit.push(previewInfo.unit);

      return info;
    });

    category.playId = _(category.playId).union();
    category.betMethod = _(category.betMethod).union();
    category.unit = _(category.unit).union();

    if (category.playId.length !== 1 || category.betMethod.length !== 1 || category.unit.length !== 1) {
      params.singleType = false;
    }
    if(!(IDsSuper3.getArr().indexOf(parseInt(category.playId.toString().slice(0,3))) === -1)){
      params.singleType = false;
    }

    _(this.options).extend(params);
  }

});

module.exports = BettingChaseView;
