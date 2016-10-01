import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickgh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickgh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找工行快捷充值支付订单号？</h3>
        <div>
          <p>
            方法一：方法 登录【<span className="text-bold-important">工行个人网银</span>】--【<span className="text-bold-important">我的帐户</span>】
            --【<span className="text-bold-important">查询电子回单</span>】详细信息。
          </p>
          <p className="quickimg">
            <img src="images/hc/gh1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/gh2.png" />
          </p>
          <p>
            方法二：方法&nbsp;查询路径：【<span className="text-bold-important">登录个人网上银行</span>】
            【<span className="text-bold-important">工银e支付</span>】【<span className="text-bold-important">订单支付明细查询</span>】
            【<span className="text-bold-important">选择查询日期段</span>】查询。
          </p>
          <p className="quickimg">
            <img src="images/hc/gh3.png" />
          </p>
          <p>
            方法三： 工行一点通/快捷查询：查询路径：【<span className="text-bold-important">登录个人网上银行</span>】
            【<span className="text-bold-important">标准版</span>】【<span className="text-bold-important">我的账户</span>】
            【<span className="text-bold-important">账务查询</span>】明细查询，选择起始日期和截止日期【<span className="text-bold-important">查询</span>】。
          </p>
          <p className="quickimg">
            <img src="images/hc/gh4.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickgh