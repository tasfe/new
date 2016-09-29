import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Pwdbrief.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Pwdbrief extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--安全类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">密保问题基本介绍</h3>
        <p>为了保障客户账户安全，平台推出了密保问题验证功能，客户选择好安全问题后，设置对应的答案即可， 同时密保信息是找回登录密码和资金密保的安全凭证，请妥善保存，切勿告诉他人。 （请牢记密保问题和答案，假如您有任何疑问可以咨询 在线客服 ）</p>
      </div>
    )
  }
}

module.exports = Pwdbrief