/**
 * 投注页 近期走势
 */

import React, { Component, PropTypes, } from 'react'
import List from 'components/List'

const Item = props => {
  let data = props.data
  return <div className="history-top-10">
    <span className="planId">{data.ticketBetPlayId}</span>
    <span className="openNumber">{data.lotteryResult.replace(/,/g, ' ')}</span>
  </div>
}

class History extends Component {
  constructor () {
    super()

    this.state = {
      list: null
    }
  }

  refresh (isOpen) {
    if (isOpen) {
      this.load()
    }
  }

  load () {
    ajax({
      url: '/ticket/bet/openHistory.json',///ticket/bet/openHistory.json
      data: {
        ticketId: this.props.id,
        pageSize: 10,
        pageIndex: 0,
      },
    }, resp => {
      if (resp && 0 === resp.result) {
        this.setState({
          list: resp.root
        })
      }
    }, () => {
      Alert({
        title: '错误',
        content: resp.msg || '获取近期开奖历史数据错误'
      })
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.list !== nextState.list 
  }

  render () {
    return <List data={this.state.list} item={Item} />
  }
}

export default History