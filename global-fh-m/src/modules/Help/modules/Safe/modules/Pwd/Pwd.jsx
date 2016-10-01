import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Pwd.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Pwd extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--安全类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">资金密码</h3>
        <p>初始账号未设置资金密码，需用户登录平台后自行设置（不能与登录密码相同）。为了自身资金安全，请仔细保管资金密码，切勿轻易泄露。</p>
        <p>温馨提示：繁华世界在线娱乐游戏客服及工作人员绝对不会以任何形式向您索要资金密码。</p>
      </div>
    )
  }
}

module.exports = Pwd