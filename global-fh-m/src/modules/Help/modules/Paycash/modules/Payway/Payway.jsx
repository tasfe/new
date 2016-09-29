import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Payway.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Payway extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">平台支持哪些充值方式？</h3>
        <p>目前平台支持：</p>
        <p className="help-bd">银联、支付宝、微信、财付通支付，预计开通信用卡支付方式。</p>
      </div>
    )
  }
}

module.exports = Payway