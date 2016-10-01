import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Withdraw.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Withdraw extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">平台支持哪些银行提现？</h3>
        <p>目前平台支持：</p>
        <p className="help-bd">中国银行、工商银行、农行银行、建设银行、招商银行、交通银行、广发银行、光大银行、浦发银行、民生银行。</p>
      </div>
    )
  }
}

module.exports = Withdraw