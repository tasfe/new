import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickmsh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickmsh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找民生银行快捷充值支付订单号？</h3>
        <div>
          <p>
            大众版：登录民生银行大众版【<span className="text-bold-important">个人网银</span>】（点此进入查询）——
            【<span className="text-bold-important">查询服务</span>】——【<span className="text-bold-important">网上支付订单查询</span>】
            ——选择查询时间段
          </p>
          <p className="quickimg">
            <img src="images/hc/ms1.png" />
          </p>
          <p>
            贵宾版：登录民生银行贵宾版【<span className="text-bold-important">个人网银</span>】——
            【<span className="text-bold-important">查询服务</span>】——【<span className="text-bold-important">网上支付订单查询</span>】
            ——选择查询时间段
          </p>
          <p className="quickimg">
            <img src="images/hc/ms2.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickmsh