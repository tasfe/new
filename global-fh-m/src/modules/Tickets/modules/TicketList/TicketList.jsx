import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import lotteryConfig from 'misc/ticketConfig'
import List from 'components/List'
import ListItem from 'components/List/Items/Lottery'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

class TicketList extends Page {

  constructor() {
    super()
  }
  
  componentDidMount () {
    this.loaded()

    this.props.setTitle('购彩大厅');

  }

  render () {
    let props = {
      data: lotteryConfig.getCompleteAll(),
      item: ListItem,
      claxx: 'lottery-list',
      itemClass: 'lottery-item',
      childrenField: 'list'
    }

    return (
      <div className="container-fluid">
        <List {...props} />
      </div>
    )
  }

}

module.exports = TicketList
