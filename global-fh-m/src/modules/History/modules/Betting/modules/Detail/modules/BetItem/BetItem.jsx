import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import WithStyles from 'with-style'
import styles from './BetItem.css'

@connect(
  state => ({}),
  actions
)

@WithStyles(styles)

class BetItem extends Page {

  constructor (props) {
    super(props);
    this.record = props.config.ticketRecord;
    this.betInfo = props.config.betRecord;

  }

  componentDidMount () {

  }

  render () {
    let status = '';
    let betMethod = '';
    let statusStyle = 0;

    if(this.betInfo.ticketBetStatus === 2) {
      status = '用户撤单';
    } else if(this.betInfo.ticketBetStatus === 3) {
      status = '系统撤单';
    } else if (this.betInfo.hasException) {
      status = '等待开奖';
    } else if(this.betInfo.openNum === null) {
      if(this.betInfo.ticketOpenStatus>0){
        status = '未中奖';
      }else {
        status = '等待开奖';
      }
    } else if (this.record.money === 0) {
      status = '未中奖';
    } else {
      status = _(this.record.money).convert2yuan();
      statusStyle = 1;
    }

    betMethod = _(this.record.singleMoney).chain().div(10000).mul(this.record.moneyMethod).convert2yuan().value();
    if (this.record.betMethod === 0) {
      betMethod = +betMethod + '/0.0%';
    } else {
      betMethod = +betMethod + '/' + _(this.record.userRebate).formatDiv(10) + '%';
    }

    return (
      <div className="record-item">
        <div className="record-inline-item"><label>玩法：</label><span>{this.record.ticketLevelName} {this.record.ticketPlayName}</span></div>
        <div className="record-inline-item" style={{width: '100%'}}><label>投注号码：</label><span>{this.record.betNums}</span></div>

        <div className="record-inline-item"><label>注数：</label><span>{this.record.betNum}</span></div>
        <div className="record-inline-item"><label>倍数：</label><span>{this.record.betMultiple}</span></div>
        <div className="record-inline-item"><label>投注模式：</label><span>{this.record.moneyMethod == 10000 ? '元' : this.record.moneyMethod === 1000 ? '角' : this.record.moneyMethod === 100 ?  '分' : '厘' }</span></div>
        <div className="record-inline-item"><label>状态：</label>{statusStyle? <span className="record-status" style={{color: '#FF7272'}}>{status}</span> : <span>{status}</span>}</div>
      </div>
    )
  }
}

module.exports = BetItem