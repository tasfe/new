import React from 'react'
import Page from 'base-page'
import withStyles from 'with-style'
import styles from './Bethistroy.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Bethistroy'

@withStyles(styles)
@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Bethistroy extends Page {

  constructor() {
    super()

    this.state = { data: null }
  }

  componentDidMount () {
    this.props.setTitle('投注记录')

    ajax({
      url: '/ticket/bethistory/userbethistory.json',
      data: {
        pageSize:30,
        ticketId: this.props.location.state.id
      }
    }, resp => {
      this.setState({
        data: resp.root.betList
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  render () {
    let children = this.props.children

    return  (
      <div className="lotlist-con">
        { children ? children : <List data={this.state.data} item={ListItem} claxx="iForm-list" itemClass="" /> }
      </div>
    )
  }
}

module.exports = Bethistroy