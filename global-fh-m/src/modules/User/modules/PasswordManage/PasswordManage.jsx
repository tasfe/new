import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './PasswordManage.css'

import LoginPwd from './modules/LoginPwd/LoginPwd'
import FundPwd from './modules/FundPwd/FundPwd'

@connect(
  state => ({}),
  actions
)
@withStyles(styles)
class OpenAccount extends Page {
  constructor () {
    super();

    this.tabConfig = {
      fields: [{
        title: '修改登录密码',
        content: <LoginPwd />
      },{
        title: '修改资金密码',
        content: <FundPwd />
      }]
    }
  }

  componentDidMount () {
    this.props.setTitle('密码管理');
    this.loaded();
  }

  render () {
    return (
      <div>
        <Tab config = {this.tabConfig} />
      </div>
    )
  }
}

module.exports = OpenAccount