import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickyzh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickyzh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找邮政银行快捷充值支付订单号？</h3>
        <div>
          <p>
            获取邮政储蓄银行快捷充值订单号的具体步骤如下：
          </p>
          <p>
            1.点击邮政储蓄网银页面上方的【<span className="text-bold-important">网上支付</span>】；
          </p>
          <p>
            2.点击网上支付栏下一行的【<span className="text-bold-important">网上支付交易查询</span>】；
          </p>
          <p>
            3.选择查询时间点击【<span className="text-bold-important">查询</span>】；
          </p>
          <p>
            4.选择您需要查询的交易信息进行截图即可。
          </p>
          <p className="quickimg">
            <img src="images/hc/yz1.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickyzh