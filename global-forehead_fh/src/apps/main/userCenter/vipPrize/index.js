"use strict";

var TabView = require('com/tabView');

var GetPrizeView = require('./getPrize');
var PrizeRecordView = require('./prizeRecord');

var VipPrizeView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass:'vip-tab',
      tabs: [
        {
          label: '领取奖金',
          name: 'getPrize',
          id: 'jsGetPrize',
          view: GetPrizeView
        },
        {
          label: '加奖记录',
          name: 'prizeRecord',
          id: 'jsPrizeRecord',
          view: PrizeRecordView
        }
      ]
    });
  }
});

module.exports = VipPrizeView;
