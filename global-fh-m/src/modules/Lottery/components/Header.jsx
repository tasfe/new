/**
 * 投注页页眉
 */

import React, { Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'
import CountingDown from 'components/CountingDown'
import Shaker from './Shaker'

@connect(state => ({
  lotteryInfo: state.lottery.lottery,
  lotteryConfig: state.lottery.lotteryConfig
}))
class Header extends Component {

  constructor () {
    super()

    this.refreshId = window.keyGenerator()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lotteryInfo !== this.props.lotteryInfo) {
      this.refreshId = window.keyGenerator()
    }
  }

  showBetMissTip () {
    let { lotteryInfo, lotteryConfig } = this.props

    window.Alert({
      backdrop: true,
      noControl: true,
      autoHide: true,
      title: '奖期切换',
      content: lotteryConfig.info.zhName + `本期已结束，投注进入第<a class="link">${lotteryInfo.nextPlanId}</a>期`
    })
  }

  render () {
    let { lotteryInfo, lotteryConfig, rightComponent, showShaker } = this.props

    if (lotteryInfo && !lotteryInfo.sale) {
      // actually directly modify the props is not recommend
      // but the props the just a shadow object that maintained
      lotteryInfo.lastOpenNum = '暂,停,销,售'
    }

    return this.props.id == 19 ? (<div className="bet-header">
        <div className="left">
          {/*<a href={`/#/lottery/${this.props.id}/oh`}>开奖记录</a>*/}
        </div>
        <div className="middle">
        </div>
        {rightComponent || (showShaker && <Shaker />)}
      </div>) : (
      <div className="bet-header">
        <div className="left">
          期号:{lotteryInfo.planId}
        </div>
        <div className="middle">
          <img src="/images/icon/fh-time-clock.png" alt="本期倒计时"/>
          <span> </span>
          <CountingDown
            refreshId={this.refreshId}
            time={lotteryInfo.totalSecond}
            left={lotteryInfo.sale ? lotteryInfo.leftSecond : 0}
            loop={!!lotteryInfo.sale}
            format="H:M:S"
            callback={::this.showBetMissTip}
          />
        </div>
        {rightComponent || (showShaker && <Shaker />)}
      </div>)
    
  }
}

export default Header