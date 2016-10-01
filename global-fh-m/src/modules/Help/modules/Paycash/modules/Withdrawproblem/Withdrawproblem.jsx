import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Withdrawproblem.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Withdrawproblem extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">未能成功提现的原因及解决办法</h3>
        <p>（1） 会员账户的存款额未满足30%投注要求。</p>
        <p>（2） 提现绑定的银行卡信息有误。</p>
        <p>（3） 银行卡被银行冻结或过期。</p>
        <p>温馨提示： 由（1）引起的提现失败，请玩家自行遵守平台提现规定后再进行提现操作； 由（2）、（3）引起的提现失败，请玩家选择匹配正确的银行卡再进行提现操作。</p>
      </div>
    )
  }
}

module.exports = Withdrawproblem