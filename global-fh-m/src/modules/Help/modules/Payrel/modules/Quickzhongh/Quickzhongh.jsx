import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickzhongh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickzhongh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找中行快捷充值支付订单号？</h3>
        <div>
          <p>
            登录&nbsp;中国银行个人网上银行页面，点击【<span className="text-bold-important">电子支付</span>】--
            【<span className="text-bold-important">网上支付</span>】--【<span className="text-bold-important">网上支付记录</span>】
            --设定搜索日期范围后点击【<span className="text-bold-important">查询</span>】；
          </p>
          <p className="quickimg">
            <img src="images/hc/zhongh1.png" />
          </p>
          <p>
            此页面将显示您的网上支付【<span className="text-bold-important">订单号</span>】，如需查看详情，
            点击对应订单的【<span className="text-bold-important">订单号</span>】即可；
          </p>
          <p className="quickimg">
            <img src="images/hc/zhongh2.png" />
          </p>
          <p>
            情页面将显示包括【支付时间】、【订单号】、【交易号】、【商户名称】、【帐户别名】、【支付帐号】、【交易货币】、交易金额和交易状态等”。
          </p>
          <p className="quickimg">
            <img src="images/hc/zhongh3.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickzhongh