import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import bettingStyles from './Betting.css'
import Button from 'components/Button'
import BetPer from './modules/BetPer/BetPer'
import BetGroup from './modules/BetGroup/BetGroup'

import BetRecord from './modules/BetPer/BetRecord'
import ChaseRecord from './modules/BetPer/ChaseRecord'

import headConfig from 'misc/headConfig'

@connect(
  state => ({
    title: state.toolbar.title,
    user: state.auth.user}),
  actions
)

@withStyles(styles)
@withStyles(bettingStyles)
class Betting extends Page {
  constructor () {
    super();

    this.tabConfig = {
      fields: [{
        title: '投注记录',
        content: <BetRecord />
      }, {
        title: '追号记录',
        content: <ChaseRecord />
      },{
        title: '中奖',
        content: <BetRecord config={{betStatus:'1'}}/>
      },{
        title: '未中奖',
        content: <BetRecord config={{betStatus:'4'}}/>
      },]
    }
  }

  render () {
    let userRoot = this.props.user && this.props.user.root?this.props.user.root:undefined;
    let isGeneralAgency = false;
    console.log(userRoot&&userRoot.uName);
    let props = {
      username: userRoot && userRoot.username || '赌神',
      headId:userRoot && userRoot.headId ||'1',
      uName: userRoot && userRoot.uName || '未命名',
      balance: userRoot && _(userRoot.balance).convert2yuan() || '0',
      vip: userRoot && ('V'+userRoot.memberLevel) || 'V0',
      letterNum: ''
    };

    let children = this.props.children;

    let config = headConfig.get(props.headId) || {};
    console.log(config,props.headId);

    return children ? children :(
      <div>
        <div className="betting-userInfo">
          <div className="betting-userInfo-img">
            <img className="betting-userInfo-img-head " src={config.img}/>


          </div>
          <div className="betting-userInfo-right">
            <div className="betting-userInfo-row1 ">
              <div className="pull-left"><span className="">{props.username}</span>(<a className="betting-userInfo-uName" href="/#/user/profile">{props.uName}</a>)</div>
              <a href="/#/message/dynamic" className="pull-right ">
                <img className="nav-userInfo-insideLetter" src="images/icon/fh-inside-letter.png"/>
                {props.letterNum}
              </a>
            </div>
            <div className="betting-userInfo-row2 ">
              <div className="pull-left">账户余额：<span className="betting-userInfo-balance-text js-user-balance">￥{props.balance}</span></div>
              <div className="pull-right"><a className="betting-userInfo-money-detail" href="/#/history/Account">资金明细&gt;</a></div>
            </div>
          </div>
        </div>
      <Tab config = {this.tabConfig} />
        </div>
    )
  }
}

module.exports = Betting