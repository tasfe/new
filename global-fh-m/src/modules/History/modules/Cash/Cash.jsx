import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import Button from 'components/Button'
import CashPer from './modules/CashPer/CashPer'
import CashGroup from './modules/CashGroup/CashGroup'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)
class Cash extends Page {
  constructor () {
    super();

    /*this.tabConfig = {
        fields: [
        {
          title: '个人记录',
        content: <CashPer />
        },
        {
          title: '团队记录',
          content: <CashGroup />
        }
      ]
    };*/
  }

  render () {
    return (
      <CashPer />
    )
  }
}

module.exports = Cash