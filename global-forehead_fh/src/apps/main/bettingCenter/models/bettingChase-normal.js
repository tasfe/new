"use strict";

var Model = require('skeleton/model');

var BettingChaseModel = Model.extend({

  url: '/ticket/chase/chaseinfo.json',

  defaults: {
    plans: [],
    chasePlans: 5,
    startMultiple: 1,
    gaps: 1,
    incMultiple: 1
  },

  parse: function(res) {
    if (res && res.result === 0) {
      return {
        plans: _(res.root).map(function(planInfo) {
          return _(planInfo).extend({
            formatTicketStarttime: _(planInfo.ticketStarttime).toTime(),
            formatTicketEndtime: _(planInfo.ticketEndtime).toTime(),
            ticketOpentime: _(planInfo.ticketOpentime).toTime()
          });
        })
      };
    }
  },

  saveChaseXhr: function(previewList, suspend) {
    previewList = _(previewList).reduce(function(list, item) {

      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        //0 高奖金 1 有返点
        betMethod: item.betMethod
      });

      return list;
    }, []);

    return Global.sync.ajax({
      url: '/ticket/chase/chase.json',
      tradition: true,
      data: {
        plan: this.get('chasePlanList'),
        play: previewList,
        suspend: suspend
      }
    });
  },

  getPlans: function(startPlanId, chasePlans) {
    var plans = this.get('plans');
    var planInfo = _(plans).findWhere({
      ticketPlanId: startPlanId
    });
    var startIndex = _(plans).indexOf(planInfo);

    return plans.slice(startIndex, _(startIndex).add(chasePlans));
  },


  initialize: function() {
    this.on('change:filters', this.updateChasePlans);
  },

  kickFirstPlan: function(planId) {
    var plans = this.get('plans');
    if (plans[0].ticketPlanId === planId) {
      this.set('plans', _(plans).rest());
    }
  },

  updateChasePlans: function() {
    var filters = this.get('filters');
    var chasePlans = this.getPlans(filters.startPlanId, filters.chasePlans);

    var currentGaps = filters.gaps;
    var times = 1;
    var multiple = 1;

    var statisticsMoney = 0;

    this.set('chasePlanList', _(chasePlans).map(function(chasePlan) {
      if (currentGaps === 0) {
        multiple = Math.pow(filters.incMultiple, times);
        ++times;
        currentGaps = filters.gaps;
      }

      --currentGaps;

      var calculate = this._calculate(chasePlan.ticketPlanId, multiple, statisticsMoney);

      statisticsMoney = calculate.statisticsMoney;

      return calculate;
    }, this));
  },

  _calculate: function(ticketPlanId, multiple, statisticsMoney) {
    var filters = this.get('filters');
    var info = this.pick('basicBettingMoney', 'maxMultiple');

    multiple = _(filters.startMultiple).mul(multiple);

    if (multiple > info.maxMultiple) {
      multiple = info.maxMultiple;
    }

    var betMoney = _(info.basicBettingMoney).mul(multiple);
    statisticsMoney = _(statisticsMoney).add(betMoney);

    return {
      ticketPlanId: ticketPlanId,
      multiple: multiple,
      betMoney: betMoney,
      statisticsMoney: statisticsMoney
    };
  },

  changeSingleMultiple: function(index, singleMultiple) {
    var statisticsMoney = 0;
    var chasePlanList = this.get('chasePlanList');
    chasePlanList[index].multiple = singleMultiple;


    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan) {
      var calculate = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, statisticsMoney);

      statisticsMoney = calculate.statisticsMoney;

      return calculate;
    }, this));
  }
});

module.exports = BettingChaseModel;
