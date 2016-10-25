import React from 'react'
import Page from 'base-page'

import WithStyles from 'with-style'
import styles from './Lottery.css'

import History from './components/History'
import Main from './components/Main'

import HistoryMMC from './components/MMC/History'
import MainMMC from './components/MMC/Main'

import { connect } from 'react-redux'
import { set, reset, loadLottery, loadLotteryPatterns } from 'redux/modules/Lottery/lottery'
import { reset as resetBetting } from 'redux/modules/Lottery/betting'
import { reset  as resetChase } from 'redux/modules/Lottery/chase'
import { setLeftButton } from 'redux/modules/toolbar'
import { getComplete } from 'misc/ticketConfig'

@connect(state => ({
  lotteryInfo: state.lottery.lottery
}), {
  set,
  reset,
  resetBetting,
  resetChase,
  loadLottery,
  loadLotteryPatterns,
  setLeftButton
})
@WithStyles(styles)
class Lottery extends Page {

  constructor (props) {
    super(props)

    this.interval = null

    this.id = props.params.id

    this.props.set({
      lotteryConfig: getComplete(Number(this.id)) // static ticket info
    })
  }

  componentDidMount () {
    this.props.setLeftButton(true);
    //MMC不需要获取奖期数据
    if(this.id!=='19'){
        this.props.loadLottery({
        data: {
          ticketId: this.id
        }
      })
    }

    this.props.loadLotteryPatterns({
      data: {
        ticketId: this.id
      },
      localKey: `LotteryPatterns/${this.id}`
    })
  }

  componentWillUpdate () {
    this.props.setLeftButton(true);
  }

  componentWillUnmount () {
    this.stopInfiniteCountingDown()
    this.props.resetChase()
    this.props.resetBetting()
    this.props.reset()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.lotteryInfo && nextProps.lotteryInfo.sale && this.id!=='19') {
      this.stopInfiniteCountingDown()
      this.setupInfiniteCountingDown()
    }
  }

  setupInfiniteCountingDown () {
    let { lotteryInfo, loadLottery} = this.props

    this.interval = window.setInterval(() => {
      if (lotteryInfo.sale) {
        loadLottery({
          data: {
            ticketId: this.id
          },
          invisualize: true
        })
      } else {
        window.clearInterval(this.interval)
      }
    }, 15 * 1000)
  }

  stopInfiniteCountingDown () {
    window.clearInterval(this.interval)
  }

  onSwipe (isOpen) {
    this.refs.history.refresh(isOpen)
  }

  render () {
    let children = this.props.children
    return children ? children :
      <div className="bet">
        {this.id==='19' ? <HistoryMMC id={this.id} ref="history" /> : <History id={this.id} ref="history" />}
        {this.id==='19'? <MainMMC id={this.id} onSwipe={::this.onSwipe} /> : <Main id={this.id} onSwipe={::this.onSwipe} />}
      </div>
  }

}

module.exports = Lottery