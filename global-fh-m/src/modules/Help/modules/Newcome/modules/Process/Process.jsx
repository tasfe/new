import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Process.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Process extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute'}}>
        <h3 className="help-tt">购彩流程</h3>
        <div className="hlep-pp">
          一.进入平台后，找到首页的产品区域，点击选择您想玩的彩种。如：重庆时时彩。
        </div>
      </div>
    )
  }
}

module.exports = Process