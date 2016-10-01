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

    let currentGaps = filters.gaps;
    let times = 1;
    let multiple = 1;

    let statisticsMoney = 0;

    this.set('chasePlanList', _(chasePlans).map(function(chasePlan) {
      if (currentGaps === 0) {
        multiple = Math.pow(filters.incMultiple, times);
        ++times;
        currentGaps = filters.gaps;
      }

      --currentGaps;

      let calculate = this._calculate(chasePlan.ticketPlanId, multiple, statisticsMoney);

      statisticsMoney = calculate.statisticsMoney;

      return calculate;
    }, this));
  }

  _calculate (ticketPlanId, multiple, statisticsMoney) {
    let filters = this.get('filters');
    let info = _(this.state).pick('basicBettingMoney', 'maxMultiple');

    multiple = _(filters.startMultiple).mul(multiple);

    if (multiple > info.maxMultiple) {
      multiple = info.maxMultiple;
    }

    let betMoney = _(info.basicBettingMoney).mul(multiple);
    statisticsMoney = _(statisticsMoney).add(betMoney);

    return {
      ticketPlanId: ticketPlanId,
      multiple: multiple,
      betMoney: betMoney,
      statisticsMoney: statisticsMoney
    };
  }

  changeSingleMultiple (index, singleMultiple) {
    let statisticsMoney = 0;
    let chasePlanList = this.get('chasePlanList');
    chasePlanList[index].multiple = singleMultiple;


    this.set('chasePlanList', _(chasePlanList).map(function(chasePlan) {
      let calculate = this._calculate(chasePlan.ticketPlanId, chasePlan.multiple, statisticsMoney);

      statisticsMoney = calculate.statisticsMoney;

      return calculate;
    }, this));
  }
  
  create (filters) {
    this.set('filters', filters)
    this.updateChasePlans()
  }
}

export default Helper