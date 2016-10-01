import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Payrel'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Payrel extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--充值相关')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '如何查找工行快捷充值支付订单号？',
      link: '#/help/Payrel/quickgh'
    }, {
      name: '如何查找招行快捷充值支付订单号？',
      link: '#/help/Payrel/quickzh'
    }, {
      name: '如何查找建行快捷充值支付订单号？',
      link: '#/help/Payrel/quickjh'
    }, {
      name: '如何查找农行快捷充值支付订单号？',
      link: '#/help/Payrel/quicknh'
    }, {
      name: '如何查找中行快捷充值支付订单号？',
      link: '#/help/Payrel/quickzhongh'
    }, {
      name: '如何查找交行快捷充值支付订单号？',
      link: '#/help/Payrel/quickjiaoh'
    }, {
      name: '如何查找民生快捷充值支付订单号？',
      link: '#/help/Payrel/quickmsh'
    }, {
      name: '如何查找中信快捷充值支付订单号？',
      link: '#/help/Payrel/quickzxh'
    }, {
      name: '如何查找广发快捷充值支付订单号？',
      link: '#/help/Payrel/quickgfh'
    }, {
      name: '如何查找邮政快捷充值支付订单号？',
      link: '#/help/Payrel/quickyzh'
    }, {
      name: '如何查找光大快捷充值支付订单号？',
      link: '#/help/Payrel/quickgdh'
    }, {
      name: '如何查找平安快捷充值支付订单号？',
      link: '#/help/Payrel/quickpah'
    }, {
      name: '如何查找浦发快捷充值支付订单号？',
      link: '#/help/Payrel/quickpfh'
    }, {
      name: '如何查找兴业快捷充值支付订单号？',
      link: '#/help/Payrel/quickxyh'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Payrel