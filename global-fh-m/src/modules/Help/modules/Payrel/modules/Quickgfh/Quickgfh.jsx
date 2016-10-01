import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickgfh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickgfh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找广发银行快捷充值支付订单号？</h3>
        <div>
          <p>
            获取广发银行快捷充值订单号的具体步骤如下：
          </p>
          <p>
            1.登陆广发银行网银页面，点击上方的【<span className="text-bold-important">网上支付</span>】；
          </p>
          <p>
            2.点击【<span className="text-bold-important">网上支付管理</span>】后，会再出现一个选择框，
            选择【<span className="text-bold-important">网上支付查询</span>】；
          </p>
          <p>
            3.选择帐号与查询的时间后，点击【<span className="text-bold-important">查询</span>】；
          </p>
          <p>
            4.选择您需要查询的交易信息进行截图即可。
          </p>
          <p className="quickimg">
            <img src="images/hc/gf1.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickgfh