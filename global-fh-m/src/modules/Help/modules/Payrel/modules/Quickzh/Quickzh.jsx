import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickzh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickzh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找招行快捷充值支付订单号？</h3>
        <div>
          <p>
            招行网上支付订单号的查询分别从大众版、专业版、进行介绍。
          </p>
          <p>
            大众版：个人银行大众版—【<span className="text-bold-important">一卡通</span>】—
            【<span className="text-bold-important">网上支付</span>】—【<span className="text-bold-important">网上支付交易查询</span>】
            —选择时间段—查询。
          </p>
          <p className="quickimg">
            <img src="images/hc/zh1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/zh2.png" />
          </p>
          <p>
            专业版：个人银行专业版—【<span className="text-bold-important">网上支付</span>】—
            【<span className="text-bold-important">一卡通支付交易查询</span>】—选择【<span className="text-bold-important">时间段</span>】
            —【<span className="text-bold-important">查询</span>】
          </p>
          <p className="quickimg">
            <img src="images/hc/zh3.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickzh