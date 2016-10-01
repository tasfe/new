import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Unlockcard.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Unlockcard extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何解锁银行卡</h3>
        <p>联系在线客服并提供正确的平台账号、银行卡号、取款人姓名等信息，经客服核实无误后完成解锁。</p>
      </div>
    )
  }
}

module.exports = Unlockcard