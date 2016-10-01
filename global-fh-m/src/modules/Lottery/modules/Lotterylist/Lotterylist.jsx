import React from 'react'
import Page from 'base-page'
import withStyles from 'with-style'
import styles from './Lotterylist.css'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Lotterylist'
import CountingDown from 'components/CountingDown'
import Button from 'components/Button'
import { setTitle } from 'redux/modules/toolbar'
import { order, reset as resetBetting } from 'redux/modules/Lottery/betting'
import { chase, reset as resetChase } from 'redux/modules/Lottery/chase'
import Link from 'react-router/lib/Link'
import Header from '../../components/Header'
import ChaseBar from './components/ChaseBar'
import Fhmmc from './components/Fhmmc'

@withStyles(styles)
@connect(state => ({
  list: state.betting.previewList,
  lotteryInfo: state.lottery.lottery,
  totalInfo: state.betting.totalInfo,
  previewList: state.betting.previewList,
  chasePlanList: state.chase.chasePlanList,
}), {
  setTitle,
  order,
  chase,
  resetBetting,
  resetChase,
})
class Lotterylist extends Page {
  constructor () {
    super()

    this.loading = false
    this.suspend = true
    this.isChase = false
  }

  componentDidMount () {
    this.props.setTitle('号码篮')
  }

  actionRespond (done, resp) {
    this.loading = false

    let actionType = this.isChase ? '追号' : '投注'

    window.Alert({
      noCancel: true,
      title: done ? '恭喜': '错误',
      type: 'confirm',
      content: done ? `${actionType}成功` : (resp.msg || `${actionType}失败`),
      callback : () => {
        if (done) {
          this.props.resetBetting()
          this.props.resetChase()
          window.history.back()
        }
      }
    })
  }

  doSomething () {
    if (this.loading) return
    this.loading = true
    let { previewList, chasePlanList, lotteryInfo, chase, order } = this.props
    if ((chasePlanList || []).length > 1) {
      chase({
        suspend: this.suspend,
        previewList,
        chasePlanList,
      }, ::this.actionRespond)
    } else {
      order(lotteryInfo.planId, ::this.actionRespond)
    }
  }

  updateSuspendState (state) {
    this.suspend = state
  }
  
  render () {
    let { totalInfo, list, chasePlanList = [] } = this.props
    let chaseNumber = chasePlanList.length || 1
    this.isChase = chaseNumber > 1
    let totalMoney = chaseNumber > 1 ? _(chasePlanList).last().statisticsMoney : totalInfo.totalMoney

    if (!list.length) {
      return <p style={{textAlign: 'center'}}>号码蓝为空，请返回添加号码后重试</p>
    }

    return  <div className="preview-list-page">
      {this.props.location.state.id == 19 ? '' : <Header />}        
      <div className="lotlist-con">
        {this.props.location.state.id == 19 ? <Fhmmc /> : ''}  
        <List data={list} item={ListItem} claxx="iForm-list" itemClass="lotlist-con-li" />
      </div>
      <div className="control-area">
        <div className="empty">
          <i className="fa fa-trash-o" /> 清空
        </div>
        <ChaseBar update={::this.updateSuspendState} />
        <div className="summary">
          <span className="summary__text">{`${totalInfo.totalLottery}注 x ${chaseNumber}期 = ${_(totalMoney).convert2yuan()}元`}</span>
          <a className="summary__button" onClick={::this.doSomething}><img src="images/icon/hammer.png" /> {this.isChase ? '追号' : '投注'}</a>
        </div>
      </div>
    </div>
  }

}

module.exports = Lotterylist