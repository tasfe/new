import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Play'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Play extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--玩法介绍')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '时时彩玩法介绍',
      link: '#/help/Play/ssc'
    }, {
      name: '11 选 5 玩法介绍',
      link: '#/help/Play/elcf'
    }, {
      name: '低频彩玩法介绍',
      link: '#/help/Play/dpc'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Play