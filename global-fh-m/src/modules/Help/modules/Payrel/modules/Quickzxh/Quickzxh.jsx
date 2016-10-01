import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickzxh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickzxh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找中信银行快捷充值支付订单号？</h3>
        <div>
          <p>
            登录中信银行官网点击【<span className="text-bold-important">转账支付</span>】—
            【<span className="text-bold-important">网上支付</span>】—【<span className="text-bold-important">订单明细查询</span>】
            输入起始日期，截止日期，点击【<span className="text-bold-important">查询</span>】
          </p>
          <p className="quickimg">
            <img src="images/hc/zx1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/zx2.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/zx3.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickzxh