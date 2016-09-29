import Base from 'redux/Helper'

class Helper extends Base { 

  getPlans (startPlanId, chasePlans) {
    let plans = this.get('plans');
    let planInfo = _(plans).findWhere({
      ticketPlanId: startPlanId
    });
    let startIndex = _(plans).indexOf(planInfo);

    return plans.slice(startIndex, _(startIndex).add(chasePlans));
  }

  updateChasePlans () {
    let filters = this.get('filters');

    let chasePlans = this.getPlans(filters.startPlanId, filters.chasePlans);
    let info = _(this.state).pick(
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
    let perRateMoneyRate = _(info.perBasicMaxBonus).div(info.perBetMoney);
    //基础利润金额
    let perRateMoney = _(info.perBasicMaxBonus).sub(info.perBetMoney);

    this.set({
      perBetMoney: info.perBetMoney,
      perBasicMaxBonus: info.perBasicMaxBonus,
      perRateMoneyRate: perRateMoneyRate,
      perRateMoney: perRateMoney
    });

    let formatChasePlans;

    if (filters.rate || filters.prevRate) {
      formatChasePlans = this.rateCalculate(chasePlans, info, filters);
    } else {
      formatChasePlans = this.amountCalculate(chasePlans, info, filters);
    }

    this.set('chasePlanList', formatChasePlans);
  }

  //利润率公式
  //公式((P-I)M)/(M+X)I > R
  //P当期奖金基础值,I投入基础值，M当前次倍数，X 之前累计的倍数，R目标利润率
  rateCalculate (chasePlans, info, filters) {

    //之前倍数总和
    let prevTotalMultiple = 0;
    let formatChasePlans = [];
    let calculated;

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
  }

  _rateCalculate (options) {
    let chasePlans = options.chasePlans;
    let prevTotalMultiple = options.prevTotalMultiple;
    let rate = _(options.rate).div(100);
    //let rate = options.rate;

    let maxMultiple = this.get('maxMultiple');
    let multiple = options.startMultiple;
    let formatChasePlans = [];

    let constant = _(rate).chain().add(1).div(this.get('perRateMoneyRate')).value();
    let calculate;

    if (constant < 0) {
      return formatChasePlans;
    }

    for(let index = 0; index < chasePlans.length; ++index) {
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
  }

  _calculate (ticketPlanId, multiple, prevTotalMultiple) {
    let info = _(this.state).pick('perBetMoney', 'perBasicMaxBonus');

    //当期投入
    let betMoney = _(info.perBetMoney).mul(multiple);
    //当期奖金
    let basicMaxBonus = _(info.perBasicMaxBonus).mul(multiple);
    //累计投入
    let statisticsMoney = _(info.perBetMoney).mul(multiple + prevTotalMultiple);
    //预期盈利
    let expectBonus =_(basicMaxBonus).sub(statisticsMoney);
    //利润率
    let bonusRate = _(expectBonus).div(statisticsMoney);

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
  }

  //利润金额公式
  //(P-I)M - XI > R
  amountCalculate (chasePlans, info, filters) {

    let prevTotalMultiple = 0;
    let formatChasePlans = [];
    let calculated;

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
  }

  _amountCalculate (options) {
    let info = options.info;
    let chasePlans = options.chasePlans;
    let prevTotalMultiple = options.prevTotalMultiple;
    let amount = _(options.amount).formatMul(10000);

    let multiple = options.startMultiple;

    let formatChasePlans = [];
    let calculate;

    for(let index = 0; index < chasePlans.length; ++index) {

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
  }

  changeSingleMultiple (singleIndex, singleMultiple) {
    let chasePlanList = this.get('chasePlanList');
    chasePlanList[singleIndex].multiple = singleMultiple;

    let prevTotalMultiple = 0;

    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan, index) {
      if (index >= singleIndex) {
        chasePlan = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, prevTotalMultiple);
      }

      prevTotalMultiple += chasePlan.multiple;

      return chasePlan;
    }, this));
  }

  create (filters) {
    this.set('filters', filters)
    this.updateChasePlans()
  }
}

export default Helper
