import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Forgetpwd.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Forgetpwd extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--安全类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">忘记密保答案怎么办？</h3>
        <p>请您仔细回忆在平台绑定的相关资料，假如实在无法想起，可以联系在线客服进行申诉。</p>
      </div>
    )
  }
}

module.exports = Forgetpwd