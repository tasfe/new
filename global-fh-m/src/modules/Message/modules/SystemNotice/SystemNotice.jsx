import React from 'react'
import Page from 'base-page'
import Link from 'react-router/lib/Link'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/SystemNotice'
import WithStyles from 'with-style'
import styles from './SystemNotice.css'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class SystemNotice extends Page {

  constructor() {
    super()

    this.state = {
      data: []
    }
  }
 
  componentDidMount () {
    this.props.setTitle('系统通知')

    ajax({
      url: '/acct/usernotice/getnoticelist.json'
    }, resp => {
      this.setState({
        data: resp.root.noticeList
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  render () {
    let children = this.props.children

    return (
      <div>
        { children ? children : <div>
          <div className="setnotice">
            <a href="/#/message/sysnotice/set"><i className="fa fa-cog"></i></a>
          </div>
          <List data={this.state.data} item={ListItem} claxx="iForm-list" itemClass="sysno-li" />
        </div> }
      </div>

    )
  }
}

module.exports = SystemNotice