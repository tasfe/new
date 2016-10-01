import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Winfo.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Winfo extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">平台提现限额、手续费及时间？</h3>
        <p>用户提现产生的手续费由平台吸收，会员不需支付任何手续费，所以为了保证出款效率，避免恶意提款给平台带来的消极影响，目前使用“向平台提现”的方式提款，平台设置单笔最低提款金额是100元，单笔最高提现金额50000元，每天提现次数不限。但超过3次以上的单笔提现收取提现金额1%的手续费，手续费单笔最高50元。</p>
        <p>全天24小时您随时都可以进行提款，您的提现会再发起提现后的5分钟内到账，如因网银系统问题或其他不可抗力因素影响，到账时间将会延迟。如延迟超过20分钟以上，请联系平台客服处理。</p>
      </div>
    )
  }
}

module.exports = Winfo