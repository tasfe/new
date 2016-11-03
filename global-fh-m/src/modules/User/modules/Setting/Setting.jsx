import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import WithStyles from 'with-style'
import styles from './Setting.css'
import Button from 'components/Button'
import Toggles from 'components/Toggles'
import { logout,load } from 'redux/modules/auth';

@connect(state => ({
  user: state.auth.user
}), {
  ...actions,
  logout,
  load
})

@WithStyles(styles)
class Setting extends Page {

  constructor() {
    super()
  }
  
  componentDidMount () {
    this.loaded()
    this.props.setTitle('设置');

  }

  render () {
    let user = this.props.user && this.props.user.root?this.props.user.root:undefined;
    let userName = user && user.username;
    let btnText = '注销退出('+userName+')';
    let customerServiceUrl = _.getCustomerServiceUrl();
    return (
      <div className="user-set-con">
        <ul>
          <li><a className="change-psd-login" href="/#/user/pm/lp">修改登录密码</a></li>
          {/*<li><a className="change-psd-fund" href="/#/user/pm?tabindex=1">修改资金密码</a></li>*/}
          <li><a className="change-psd-fund" href="/#/user/pm/fp">修改资金密码</a></li>
          <li><a className="change-sq-quest" href="/#/user/sqm">修改安全问题</a></li>
        </ul>
        <ul>
          <li><a className="bind-card" href="/#/user/bankcard">银行卡绑定</a></li>
          <li><a className="open-acc" href="/#/agency/oa">开户管理</a></li>
        </ul>
        <ul>
          <li><a className="online-service" href={customerServiceUrl} target="_blank">在线客服</a></li>
          {/*<li>
            <a className="set-notice" href="">
              <Toggles
                config={{
                  type: 'toggle',
                  name: 'setNotice',
                  text: '通知设置',
                  defaultValue: true,
                  data: ''
                }}
                onClick={::this.setNotice}/>
            </a>
          </li>*/}
        </ul>
        {/*<ul>
          <li><a className="update" href="">版本更新<div className="can-update">有新版本</div></a></li>
        </ul>*/}
        <div className="user-logout">
          <Button config={{
              text: '注销退出('+userName+')',
              className: 'btn-red waves-light btn-middle'
            }} onClick={::this.logout} />
        </div>
      </div>
    )
  }

  logout () {
    window.Alert({
      content: '确定要退出登录？',
      type: 'confirm',
      callback: () => {
        this.props.logout()
      }
    });
  }

  setNotice () {

  }

}

module.exports = Setting
