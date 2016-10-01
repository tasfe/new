import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import Button from 'components/Button'
import RechargePer from './modules/RechargePer/RechargePer'
import RechargeGroup from './modules/RechargeGroup/RechargeGroup'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)
class Recharge extends Page {
  constructor () {
    super();

    /*this.tabConfig = {
        fields: [
        {
          title: '个人记录',
        content: <RechargePer />
        },
        {
          title: '团队记录',
          content: <RechargeGroup />
        }
      ]
    };*/
  }

  render () {
    return (
      <RechargePer />
    )
  }
}

module.exports = Recharge