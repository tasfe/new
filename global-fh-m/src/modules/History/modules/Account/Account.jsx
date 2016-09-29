import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { logout, load } from 'redux/modules/auth';
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import accountStyles from './Account.css'
import Button from 'components/Button'
import RecordPer from './modules/RecordPer/RecordPer'
import MoneyRecord from './modules/RecordPer/MoneyRecord'
import RecordGroup from './modules/RecordGroup/RecordGroup'
import { setTitle,setLeftButton } from 'redux/modules/toolbar'

@connect(
  state => ({
    title: state.toolbar.title,
    user: state.auth.user
  }),{
  actions,
  logout,
  load,
  setTitle,
  setLeftButton
  }
)

@withStyles(styles)
@withStyles(accountStyles)
class Account extends Page {
  constructor () {
    super();

    this.tabConfig = {
        fields: [
          {
            title: '所有类型',
          content: <MoneyRecord />
          },
          {
            title: '游戏充值',
            content: <MoneyRecord config={{tradeType:'100'}}/>
          },
          {
            title: '平台转账',
            content: <MoneyRecord  config={{tradeType:'104'}} />
          },
          {
            title: '奖金派送',
            content: <MoneyRecord  config={{tradeType:'120'}}/>
          }
      ]
    };
  }

  componentDidMount () {
    this.props.setTitle('资金明细');
    this.props.setLeftButton(true);
  }

  render () {
    return (

      <div>
        <div className="account-detail">
          <div className="account-detail-item account-detail-item1">
            <div className="account-detail-item-desc" >
              总余额（元）<br/>
              <span className="js-md-total-balance account-detail-amount">{this.props.totalMoney||'-'}</span>
            </div>
          </div>
          <div className="account-detail-item account-detail-item2">
            <div className="account-detail-item-desc" >
              昨日返点（元）<br/>
            <span className="js-md-total-bonus account-detail-amount">{this.props.rebateMoney||'-'}</span></div>
          </div>
          <div className="account-detail-item account-detail-item3">
            <div className="account-detail-item-desc" >
              昨日投注（元）<br/>
            <span className="js-md-total-bet account-detail-amount">{this.props.totalBet||'-'}</span></div>
          </div>
          <div className="account-detail-item">
            <div className="account-detail-item-desc" >
              昨日中奖（元）<br/>
              <span className="js-md-total-prize account-detail-amount">{this.props.prize||'-'}</span>
            </div>
          </div>
        </div>
        <Tab config = {this.tabConfig} />
      </div>
    )
  }
}

module.exports = Account;