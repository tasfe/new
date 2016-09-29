import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

import ValidateQuestion from './modules/ValidateQuestion/ValidateQuestion'
import ConfigQuestion from './modules/ConfigQuestion/ConfigQuestion'
import ConfirmQuestion from './modules/ConfirmQuestion/ConfirmQuestion'
import withStyles from 'with-style'
import styles from './SecurityQuestion.css'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)

class SecurityQuestion extends Page {
  constructor () {
    super()

  }

  componentDidMount () {
    this.props.setTitle('密保问题');
    this.loaded();
  }

  render () {
    return (
      <div className="">
          <div className="js-uc-sq-val-container form-container ">
              <div className="pm-fi-step">第一步：验证密保问题</div>
              <ValidateQuestion />
          </div>
          <div className="js-uc-sq-config-container form-container hidden">
              <div className="pm-fi-step">第二步：设置密保问题</div>
              <ConfigQuestion />
          </div>
          <div className="js-uc-sq-confirm-container form-container hidden">
              <div className="pm-fi-step">第三步：确认密保问题</div>
              <ConfirmQuestion />
          </div>
      </div>

    )
  }
}

module.exports = SecurityQuestion