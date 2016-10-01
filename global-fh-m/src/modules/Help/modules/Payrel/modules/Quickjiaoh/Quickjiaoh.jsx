import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickjiaoh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickjiaoh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找交行快捷充值支付订单号？</h3>
        <div>
          <p>
            登陆交行网站，点击个人网银登陆，输入登录信息，选择网上银【<span className="text-bold-important">支付交易查询</span>】—
            选择起始、截止时间，点击【<span className="text-bold-important">下一步</span>】
          </p>
          <p className="quickimg">
            <img src="images/hc/jiaoh1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jiaoh2.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jiaoh3.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jiaoh4.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/jiaoh5.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickjiaoh