import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './ActiveDetail.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class ActiveDetail extends Page {
  
  componentDidMount () {
    this.props.setTitle('活动详情')
  }

  render () {
    /*return (
      <div className="padding-h-sm">
        <h3 className="notice-det-tt">发送通知</h3>
        <div className="notice-det-con">
          this is text of system notice
        </div>
        <p className="text-align-rt">系统管理员</p>
        <p className="text-align-rt">2014-12-12 12:00:00</p>
        
      </div>
    )*/
    return(
      <div className="padding-h-sm">活动详情 页面</div>
    )
  }
}

module.exports = ActiveDetail