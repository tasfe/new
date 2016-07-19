"use strict";

var Model = require('skeleton/model');

var BettingChaseModel = Model.extend({

  url: '/ticket/chase/chaseinfo.json',

  defaults: {
    plans: [],
    chasePlans: 5,
    startMultiple: 1,
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
    var self = this;

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

  initialize: function() {
    this.on('change:filters', this.updateChasePlans);
  },

  kickFirstPlan: function(planId) {
    var plans = this.get('plans');
    if (plans[0].ticketPlanId === planId) {
      this.set('plans', _(plans).rest());
    }
  },

  getPlans: function(startPlanId, chasePlans) {
    var plans = this.get('plans');
    var planInfo = _(plans).findWhere({
      ticketPlanId: startPlanId
    });
    var startIndex = _(plans).indexOf(planInfo);

    return plans.slice(startIndex, _(startIndex).add(chasePlans));
  },

  updateChasePlans: function() {
    var filters = this.get('filters');

    var chasePlans = this.getPlans(filters.startPlanId, filters.chasePlans);
    var info = this.pick(
      'basicBettingMoney',
      'basicMaxBonus'
    );

    filters.startMultiple = Number(filters.startMultiple);

    //投入基础值
    info.perBetMoney = info.basicBettingMoney;
    //info.perBetMoney = _(info.basicBettingMoney).mul(filters.startMultiple);
    //当期奖金基础值
    info.perBasicMaxBonus = info.basicMaxBonus;
    //info.perBasicMaxBonus = _(info.basicMaxBonus).mul(filters.startMultiple);
    //基础利润比率
    var perRateMoneyRate = _(info.perBasicMaxBonus).div(info.perBetMoney);
    //基础利润金额
    var perRateMoney = _(info.perBasicMaxBonus).sub(info.perBetMoney);

    this.set({
      perBetMoney: info.perBetMoney,
      perBasicMaxBonus: info.perBasicMaxBonus,
      perRateMoneyRate: perRateMoneyRate,
      perRateMoney: perRateMoney
    });

    var formatChasePlans;

    if (filters.rate || filters.prevRate) {
      formatChasePlans = this.rateCalculate(chasePlans, info, filters);
    } else {
      formatChasePlans = this.amountCalculate(chasePlans, info, filters);
    }

    this.set('chasePlanList', formatChasePlans);
  },

  //利润率公式
  //公式((P-I)M)/(M+X)I > R
  //P当期奖金基础值,I投入基础值，M当前次倍数，X 之前累计的倍数，R目标利润率
  rateCalculate: function(chasePlans, info, filters) {

    //之前倍数总和
    var prevTotalMultiple = 0;
    var formatChasePlans = [];
    var calculated;

    if (_.isUndefined(filters.rate)) {
      calculated = this._rateCalculate({
        info: info,
        chasePlans: chasePlans.slice(0, Number(filters.prevPlans)),
        prevTotalMultiple: prevTotalMultiple,
        rate: filters.prevRate,
        startMultiple: filters.startMultiple
      });

      prevTotalMultiple = calculated.prevTotalMultiple;
      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);

      if (!_.isEmpty(calculated.formatChasePlans)) {
        calculated = this._rateCalculate({
          info: info,
          chasePlans: chasePlans.slice(Number(filters.prevPlans)),
          prevTotalMultiple: prevTotalMultiple,
          rate: filters.afterRate,
          startMultiple: filters.startMultiple
        });

        formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);
      }
    } else {
      calculated = this._rateCalculate({
        chasePlans: chasePlans,
        prevTotalMultiple: prevTotalMultiple,
        rate: filters.rate,
        startMultiple: filters.startMultiple
      });

      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);
    }

    return formatChasePlans;
  },

  _rateCalculate: function(options) {
    var chasePlans = options.chasePlans;
    var prevTotalMultiple = options.prevTotalMultiple;
    var rate = _(options.rate).div(100);
    //var rate = options.rate;

    var maxMultiple = this.get('maxMultiple');
    var multiple = options.startMultiple;
    var formatChasePlans = [];

    var constant = _(rate).chain().add(1).div(this.get('perRateMoneyRate')).value();
    var calculate;

    if (constant < 0) {
      return formatChasePlans;
    }

    for(var index = 0; index < chasePlans.length; ++index) {
      calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple);

      if (calculate.bonusRate < rate) {
        multiple = Math.ceil(_(prevTotalMultiple).chain().mul(constant).div(_(1).sub(constant)).value());

        calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple);
      }

      if (multiple > maxMultiple || multiple <= 0) {
        break;
      }

      prevTotalMultiple += multiple;

      formatChasePlans.push(calculate);
    }

    return {
      prevTotalMultiple: prevTotalMultiple,
      formatChasePlans: formatChasePlans
    };
  },

  _calculate: function(ticketPlanId, multiple, prevTotalMultiple) {
    var info = this.pick('perBetMoney', 'perBasicMaxBonus');

    //当期投入
    var betMoney = _(info.perBetMoney).mul(multiple);
    //当期奖金
    var basicMaxBonus = _(info.perBasicMaxBonus).mul(multiple);
    //累计投入
    var statisticsMoney = _(info.perBetMoney).mul(multiple + prevTotalMultiple);
    //预期盈利
    var expectBonus =_(basicMaxBonus).sub(statisticsMoney);
    //利润率
    var bonusRate = _(expectBonus).div(statisticsMoney);

    return {
      ticketPlanId: ticketPlanId,
      multiple: multiple,
      betMoney: betMoney,
      statisticsMoney: statisticsMoney,
      basicMaxBonus: basicMaxBonus,
      expectBonus: expectBonus,
      bonusRate: bonusRate,
      prevTotalMultiple: prevTotalMultiple
    };
  },

  //利润金额公式
  //(P-I)M - XI > R
  amountCalculate: function(chasePlans, info, filters) {

    var prevTotalMultiple = 0;
    var formatChasePlans = [];
    var calculated;

    if (_.isUndefined(filters.amount)) {
      calculated = this._amountCalculate({
        info: info,
        chasePlans: chasePlans.slice(0, Number(filters.prevPlans)),
        prevTotalMultiple: prevTotalMultiple,
        amount: filters.prevAmount,
        startMultiple: filters.startMultiple
      });

      prevTotalMultiple = calculated.prevTotalMultiple;
      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);

      if (!_.isEmpty(calculated.formatChasePlans)) {
        calculated = this._amountCalculate({
          info: info,
          chasePlans: chasePlans.slice(Number(filters.prevPlans)),
          prevTotalMultiple: prevTotalMultiple,
          amount: filters.afterAmount,
          startMultiple: filters.startMultiple
        });

        formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);
      }
    } else {
      calculated = this._amountCalculate({
        info: info,
        chasePlans: chasePlans,
        prevTotalMultiple: prevTotalMultiple,
        amount: filters.amount,
        startMultiple: filters.startMultiple
      });

      formatChasePlans = formatChasePlans.concat(calculated.formatChasePlans);
    }

    return formatChasePlans;
  },

  _amountCalculate: function(options) {
    var info = options.info;
    var chasePlans = options.chasePlans;
    var prevTotalMultiple = options.prevTotalMultiple;
    var amount = _(options.amount).formatMul(10000);

    var multiple = options.startMultiple;

    var formatChasePlans = [];
    var calculate;

    for(var index = 0; index < chasePlans.length; ++index) {

      calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple);

      if (calculate.expectBonus < amount) {
        multiple = Math.ceil(_(amount).chain().add(_(info.perBetMoney).mul(prevTotalMultiple)).div(this.get('perRateMoney')).value());

        calculate = this._calculate(chasePlans[index].ticketPlanId, multiple, prevTotalMultiple);
      }

      if (multiple > info.maxMultiple || multiple <= 0) {
        break;
      }

      prevTotalMultiple += multiple;

      formatChasePlans.push(calculate);
    }

    return {
      prevTotalMultiple: prevTotalMultiple,
      formatChasePlans: formatChasePlans
    };
  },

  changeSingleMultiple: function(singleIndex, singleMultiple) {
    var chasePlanList = this.get('chasePlanList');
    chasePlanList[singleIndex].multiple = singleMultiple;

    var prevTotalMultiple = 0;

    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan, index) {
      if (index >= singleIndex) {
        chasePlan = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, prevTotalMultiple);
      }

      prevTotalMultiple += chasePlan.multiple;

      return chasePlan;
    }, this));
  }
});

module.exports = BettingChaseModel;
