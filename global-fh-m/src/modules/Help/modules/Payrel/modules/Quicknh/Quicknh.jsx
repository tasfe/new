import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quicknh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quicknh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找农行快捷充值支付订单号？</h3>
        <div>
          <p>
            登录农业银行点击【<span className="text-bold-important">缴费支付</span>】—
            【<span className="text-bold-important">网上支付交易查询</span>】选择日期，点击【<span className="text-bold-important">确定</span>】
            这里的订单编号就是快捷充值订单号
          </p>
          <p className="quickimg">
            <img src="images/hc/nh1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/nh2.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/nh3.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quicknh