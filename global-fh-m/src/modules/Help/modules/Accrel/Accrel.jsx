import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Accrel'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Accrel extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--账号相关')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '忘记登录密码怎么办？',
      link: '#/help/Accrel/forloginpwd'
    }, {
      name: '忘记资金密码怎么办？'
    }, {
      name: '上下级如何联系？'
    }, {
      name: '如何查询当前IP地址？',
      link: '#/help/Accrel/findip'
    }, {
      name: '如何取消系统通知？'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Accrel