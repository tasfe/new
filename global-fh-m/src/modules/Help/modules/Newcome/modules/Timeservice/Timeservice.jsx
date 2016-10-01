import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Timeservice.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Timeservice extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute'}}>
        <h3 className="help-tt">在线客服服务时间</h3>
        <div className="hlep-pp">
          <p>
            在线客服全天24小时为您提供最优质且专业的咨询服务。如有疑问，欢迎您随时联系在线客服进行咨询处理。
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Timeservice