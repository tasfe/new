import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Beth.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Beth extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute', width: '100%'}}>
        <h3 className="help-tt">投注记录查询</h3>
        <div className="hlep-pp">
          在首页导航栏的”历史记录”里选择“投注记录”。
        </div>
      </div>
    )
  }
}

module.exports = Beth