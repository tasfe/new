import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickxyh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickxyh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找兴业银行快捷充值支付订单号？</h3>
        <div>
          <p>
            获取兴业银行快捷充值订单号的具体步骤如下：
          </p>
          <p>
            1.点击兴业银行网银页面顶端的【<span className="text-bold-important">网上支付</span>】；
          </p>
          <p>
            2.在网上支付栏的下一行点击【<span className="text-bold-important">网上支付明细查询</span>】；
          </p>
          <p>
            3.选择您需要查询的银行账户点击【<span className="text-bold-important">下一步</span>】；
          </p>
          <p>
            4.选择查询时间点击【<span className="text-bold-important">查询</span>】；
          </p>
          <p>
            5.选择您需要查询的该笔交易信息进行截图即可。
          </p>
          <p className="quickimg">
            <img src="images/hc/xy1.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickxyh