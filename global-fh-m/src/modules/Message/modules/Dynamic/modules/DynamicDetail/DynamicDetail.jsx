import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './DynamicDetail.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import { setLeftButton } from 'redux/modules/toolbar'
import { setTitle } from 'redux/modules/toolbar'

@connect(
  state => ({title: state.toolbar.title}),
  {...actions, setTitle, setLeftButton}
)
@WithStyles(styles)
class DynamicDetail extends Page {

  constructor() {
    super()

    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.setTitle('平台公告');
    this.props.setLeftButton(true);
    ajax({
      url: '/info/activitylist/userGetbulletindetail.json',
      data: {
        bulletinId: this.props.params.id
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
        { this.state.data.time && <p className="text-align-ct">时间：{new Date(this.state.data.time).toString('yyyy-MM-dd HH:mm:ss')}</p> }
        <div className="notice-det-con" dangerouslySetInnerHTML={{__html: this.state.data.content}}>
        </div>
      </div>
    )
  }
}

module.exports = DynamicDetail