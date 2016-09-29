import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Newcome'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Newcome extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '关于我们',
      link: '#/help/newcome/aboutus'
    }, {
      name: '目前有哪些彩种可以投注',
      link: '#/help/newcome/tickets'
    }, {
      name: '购彩流程',
      link: '#/help/newcome/process'
    }, {
      name: '投注记录查询',
      link: '#/help/newcome/beth'
    }, {
      name: '在线客服服务时间',
      link: '#/help/newcome/ts'
    }, {
      name: '无法打开在线客服窗口怎么办？',
      link: '#/help/newcome/os'
    }]

    return  children ? children : (
       <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" />
    )
  }
}

module.exports = Newcome