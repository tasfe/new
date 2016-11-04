/**
 * 投注页 页脚
 */

import React, { Component, PropTypes} from 'react'
import Toggle from 'components/Toggles'
import NumberRange from 'components/NumberRange'
// import { set as setBetting, add } from 'redux/modules/Lottery/betting'
import { connect } from 'react-redux'
import { create, setHelper, set as chaseConfig } from 'redux/modules/Lottery/chase'
import { routerActions } from 'react-router-redux'

@connect(state => ({
  lotteryInfo: state.lottery.lottery,
  statistics: state.betting.statistics,
  prefabMoney: state.betting.prefabMoney,
  list: state.betting.previewList,
  multiple: state.betting.multiple,
  previewList: state.betting.previewList,
}), {
  // setBetting,
  // add,
  create,
  setHelper,
  chaseConfig,
  pushState: routerActions.push,
})
class Footer extends Component {
  static propTypes = {
    update: PropTypes.func
  }

  static defaultProps = {
    update: () => {},
    succession: () => {}
  }
  
  constructor (props) {
    super(props)

    this.state = {
      chaseNumber: 1,
      maxChasePlans: 10,
    }

    this.hasLoadChasePlans = false
    this.getchaseParams(props.previewList)
  }
  
  componentDidMount () {
    this.props.setHelper('normal')
  }

  onNumberChange (number) {
    this.setState({
      chaseNumber: number
    })
    this.props.succession(number)
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
    };

    this.props.chaseConfig({...params})

    return this.chaseParams = params
  }

  onChaseFlagChange (e) {
    this.props.update(e.target.checked)
  }
  

  render () {
    let { lotteryInfo, statistics, prefabMoney, list, multiple } = this.props
    let chaseNumber = this.state.chaseNumber

    return <div className="chase">
      <div className="chase__number">连续开奖 <NumberRange defaultValue={1} max={this.state.maxChasePlans} onChange={::this.onNumberChange} /></div>
      <div className="chase__flag">
        <Toggle config={{
          type: 'checkbox',
          text: '中奖即停',
          checked: true,
          disabled: chaseNumber < 2,
          onClick: ::this.onChaseFlagChange,
        }} />
      </div>
    </div>
  }

}

export default Footer
