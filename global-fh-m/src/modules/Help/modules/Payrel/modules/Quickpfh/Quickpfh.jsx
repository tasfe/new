import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickpfh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickpfh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找浦发银行快捷充值支付订单号？</h3>
        <div>
          <p>
            获取浦发银行快捷充值订单号的具体步骤如下：
          </p>
          <p>
            1.点击浦发银行网银页面左侧的【<span className="text-bold-important">缴费与支付</span>】；
          </p>
          <p>
            2.在“网上支付”栏选择【<span className="text-bold-important">支付明细查询</span>】；
          </p>
          <p>
            3.选择您需要查询的该笔交易信息进行截图即可。
          </p>
          <p className="quickimg">
            <img src="images/hc/pf1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/pf2.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickpfh