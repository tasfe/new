import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickjh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickjh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找建行快捷充值支付订单号？</h3>
        <div>
          <p>
            登陆建设银行网上银行输入【<span className="text-bold-important">登录信息</span>】点击
            【<span className="text-bold-important">客户服务</span>】—【<span className="text-bold-important">日志查询</span>】—
            【<span className="text-bold-important">选择时间</span>】-【<span className="text-bold-important">查询订单号</span>】查看详情。
          </p>
          <p className="quickimg">
            <img src="images/hc/jh1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jh2.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jh3.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jh4.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickjh