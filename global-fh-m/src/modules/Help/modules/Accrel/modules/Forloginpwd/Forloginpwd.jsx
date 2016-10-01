import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Forloginpwd.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Forloginpwd extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--账号相关')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">忘记登录密码怎么办？</h3>
        <div>
          
        </div>
      </div>
    )
  }
}

module.exports = Forloginpwd