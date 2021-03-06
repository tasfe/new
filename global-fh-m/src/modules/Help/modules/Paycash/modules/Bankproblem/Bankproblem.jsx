import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Bankproblem.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Bankproblem extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">完成银行转账15分钟以上充值仍未到账的原因及解决办法</h3>
        <p>（1）汇款未使用平台提供的最新银行信息</p>
        <p>（2）汇款时候附言填写错误或者未填写</p>
        <p>（3）平台填写金额与实际汇款金额不一致</p>
        <p>（4）平台填写充值信息之后，超过30分钟才进行汇款</p>
        <p>以上任何一点都会引起您的充值未到账，请及时联系客服，并提供银行回单截图等相关证明。  注：需提供的证明——平台账户名、银行转账汇款回执单截图（截图需包含汇款人姓名、汇款银行卡号以及金额和汇款的具体时间）</p>
      </div>
    )
  }
}

module.exports = Bankproblem