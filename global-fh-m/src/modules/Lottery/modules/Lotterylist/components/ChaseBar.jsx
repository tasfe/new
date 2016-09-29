import React, { Component, PropTypes } from 'react'
import Toggle from 'components/Toggles'
import NumberRange from 'components/NumberRange'
import Button from 'components/Button'
import { connect } from 'react-redux'
import { create, setHelper, set as chaseConfig } from 'redux/modules/Lottery/chase'
import { routerActions } from 'react-router-redux'

@connect(state => ({
  previewList: state.betting.previewList,
  lotteryInfo: state.lottery.lottery,
}), {
  create,
  setHelper,
  chaseConfig,
  pushState: routerActions.push,
})
class ChaseBar extends Component {
  static propTypes = {
    update: PropTypes.func
  }

  static defaultProps = {
    update: () => {}
  }

  constructor (props) {
    super(props)

    this.state = {
      chaseNumber: 1,
      maxChasePlans: 2,
    }

    this.hasLoadChasePlans = false
    this.getchaseParams(props.previewList)
  }

  componentDidMount() {
    this.props.setHelper('normal')
  }

  createChasePlanList (chaseCount) {
    this.props.create({
      chasePlans: chaseCount,
      startPlanId: this.props.lotteryInfo.planId,
    })
  }

  loadChasePlans (cb) {
    ajax({
      url: '/ticket/chase/chaseinfo.json',
      data: {
        ticketId: this.props.lotteryInfo.ticketId,
      }
    }, cb, () => {
      Alert({
        title: '错误',
        content: '追号数据请求失败'
      })
    })
  }

  onNumberChange (number) {
    this.setState({
      chaseNumber: number
    })

    if (number > 0) {
      if (this.hasLoadChasePlans) {
        this.createChasePlanList(number)
      } else {
        this.loadChasePlans(resp => {
          this.hasLoadChasePlans = true
          this.props.chaseConfig({
            plans: resp.root
          })
          this.setState({
            maxChasePlans: resp.root.length
          })
          this.createChasePlanList(number)
        })
      }
    }
  }

  onChaseFlagChange (e) {
    this.props.update(e.target.checked)
  }

  getchaseParams (previewList) {
    var params = {
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

    // 之前 将所有倍数变为1的魔法就在这个map里面  如果今后需要施加其他的魔法 就在这里施展吧 :)
    _(previewList).map(function(previewInfo) {
      if (previewInfo.maxMultiple < params.maxMultiple) {
        params.maxMultiple = previewInfo.maxMultiple;
      }
      // params.prefabMoney = _(previewInfo.prefabMoney).div(previewInfo.multiple);
      // params.basicBettingMoney = _(params.basicBettingMoney).add(params.prefabMoney);
      params.basicBettingMoney = _(params.basicBettingMoney).add(previewInfo.prefabMoney);
      params.basicMaxBonus = _(params.basicMaxBonus).add(_(previewInfo.formatMaxBonus).div(previewInfo.multiple));

      category.playId.push(previewInfo.playId);
      category.betMethod.push(previewInfo.betMethod);
      category.unit.push(previewInfo.unit);

      return previewInfo
    });

    category.playId = _(category.playId).union();
    category.betMethod = _(category.betMethod).union();
    category.unit = _(category.unit).union();

    if (category.playId.length !== 1 || category.betMethod.length !== 1 || category.unit.length !== 1) {
      params.singleType = false;
    }

    this.props.chaseConfig({...params})

    return this.chaseParams = params
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.previewList !== nextProps.previewList) {
      this.getchaseParams(nextProps.previewList)
    }  
  }

  render () {
    let chaseNumber = this.state.chaseNumber

    return <div className="chase">
      <div className="chase__number">普通追号 <NumberRange defaultValue={1} max={this.state.maxChasePlans} onChange={::this.onNumberChange} /></div>
      <div className="chase__flag">
        <Toggle config={{
          type: 'checkbox',
          text: '追中即停',
          checked: true,
          disabled: chaseNumber < 2,
          onClick: ::this.onChaseFlagChange,
        }} />
      </div>
      <div>
        <Button config={{
          className: cx({
            'chase__button': true,
            'btn-red': !!this.chaseParams.singleType
          }),
          text: '高级追号',
        }} disabled={!this.chaseParams.singleType}
        onClick= {() => {
          this.props.pushState(`/lottery/${this.props.lotteryInfo.ticketId}/chase`)
        }} />
      </div>
    </div>
  }
}

export default ChaseBar