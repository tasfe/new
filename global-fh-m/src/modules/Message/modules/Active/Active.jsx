import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Active.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Active'
import Pagination from 'components/Pagination'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Active extends Page {
  
  constructor() {
    super()

    this.state = {
      data: [],
      dataP:{rowCount:0}
    }
    this.pageSize = 6
    this.pageIndex = 0
  }

  componentDidMount () {
    this.props.setTitle('活动中心')
    this.getDaynamic()
  }
  getDaynamic(data){
    ajax({
      url: '/info/activitylist/getactivitylist.json',
      data: {
        pageSize:this.pageSize,
        pageIndex:this.pageIndex
      }
    }, resp => {
      this.setState({
        data: resp.root.activityList,
        dataP: resp.root
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  onPageChange (index) {
    (index + 1) && this.getDaynamic({
      pageIndex: this.pageIndex = index
    })
  }

  render () {
    let children = this.props.children
    return children ? children :(
      <div >
        <div className="help-block">查看活动详情请前往PC端访问！</div>
        <List data={this.state.data} item={ListItem} claxx="iForm-list act-form" itemClass='act-li' /> 
        <Pagination
          onChange={::this.onPageChange}
          index={this.pageIndex}
          size={this.pageSize}
          data={this.state.dataP || {} }/>
      </div>
    )

  }
}

module.exports = Active