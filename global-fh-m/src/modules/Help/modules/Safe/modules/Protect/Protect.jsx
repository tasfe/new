import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Protect.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Protect extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--安全类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何避免账户被盗用？</h3>
        <p>（1）提高网络安全意识，请不要随意上不明的网站，不接受不明信息来源的文件，防止木马入侵电脑，并定期对电脑进行安全检查，避免电脑中病毒和木马导致账户被盗；</p>
        <p>（2）首次登录平台，修改初始登录密码并设定账户资金密码，同时锁定您需要用来提款的银行账户；</p>
        <p>（3）妥善保管您的登录密码和资金密码，同时切勿相信他人以任何理由向您索要繁华世界在线娱乐账户的登录密码及资金密码；</p>
      </div>
    )
  }
}

module.exports = Protect