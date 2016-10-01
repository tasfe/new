import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Quickgdh.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Quickgdh extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">如何查找光大银行快捷充值支付订单号？</h3>
        <div>
          <p>
            获取光大银行快捷充值订单号的具体步骤如下：
          </p>
          <p>
            1.点击光大银行网银页面上方的【<span className="text-bold-important">更多功能</span>】；
          </p>
          <p>
            2.在选择框中选择【电子支付】后会出现另一个选择框，点击【<span className="text-bold-important">电子支付</span>】；
          </p>
          <p>
            3.选择您需要查询的该笔交易信息进行截图即可。
          </p>
          <p>
            4.选择您需要查询的交易信息进行截图即可。
          </p>
          <p className="quickimg">
            <img src="images/hc/gd1.png" />
          </p>
          <p className="quickimg">
            <img src="images/hc/gd2.png" />
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Quickgdh