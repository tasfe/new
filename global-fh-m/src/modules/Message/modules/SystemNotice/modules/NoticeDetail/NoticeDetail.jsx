import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './NoticeDetail.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class NoticeDetail extends Page {
  constructor() {
    super()

    this.state = {
      data: []
    }
  }
  componentDidMount () {
    this.props.setTitle('系统通知')
    ajax({
      url: '/acct/usernotice/getusernoticedetail.json',
      data: {
        noticeId: this.props.params.id
      }
    }, resp => {
      this.setState({
        data: resp.root
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  render () {
    return (
      <div className="padding-h-sm">
        <h3 className="notice-det-tt">{this.state.data.title}</h3>
        { this.state.data.sendName && <p className="text-align-ct">发件人：{this.state.data.sendName}</p> }
        { this.state.data.sendTime && <p className="text-align-ct">时间：{new Date(this.state.data.sendTime).toString('yyyy-MM-dd HH:mm:ss')}</p> }
        <div className="notice-det-con">{this.state.data.context}</div>
      </div>
    )
  }
}

module.exports = NoticeDetail