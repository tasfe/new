import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Safe'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Safe extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--安全类')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '如何避免账户被盗用？',
      link: '#/help/Safe/protect'
    }, {
      name: '资金密码',
      link: '#/help/safe/pwd'
    }, {
      name: '密保问题基本介绍',
      link: '#/help/Safe/Pwdbrief'
    }, {
      name: '忘记密保答案怎么办？',
      link: '#/help/Safe/forgetpwd'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Safe