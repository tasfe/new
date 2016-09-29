import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Paycash'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Paycash extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--充提类')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '平台支持哪些充值方式？',
      link: '#/help/Paycash/payway'
    }, {
      name: '平台支持哪些银行提现？',
      link: '#/help/Paycash/withdraw'
    }, {
      name: '平台充值流程'
    }, {
      name: '平台提现流程'
    }, {
      name: '完成银行转账15分钟以上充值仍未到账的原因及解决办法',
      link: '#/help/Paycash/bankproblem'
    }, {
      name: '未能成功提现的原因及解决办法',
      link: '#/help/Paycash/wp'
    }, {
      name: '如何解锁银行卡',
      link: '#/help/Paycash/unlockcard'
    }, {
      name: '平台提现限额、手续费及时间？',
      link: '#/help/Paycash/winfo'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Paycash