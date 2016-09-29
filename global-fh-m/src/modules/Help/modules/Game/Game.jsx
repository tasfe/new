import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Game'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Game extends Page {
 
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
    this.loaded()
  }

  render () {
    let children = this.props.children

    let data = [{
      name: '官方未开奖如何处理？',
      link: '#/help/game/notopen'
    }, {
      name: '什么是恶意投注？',
      link: '#/help/game/illegal'
    }, {
      name: '什么是冷热号？',
      link: '#/help/game/chot'
    }, {
      name: '什么是追号？',
      link: '#/help/game/chase'
    }, {
      name: '平台各个追号玩法含义',
      link: '#/help/game/chaseinfo'
    }]

    return (
      <div >
        { children ? children : <List data={data} item={ListItem} claxx="iForm-list" itemClass="help-li" /> }
      </div>
    )
  }
}

module.exports = Game