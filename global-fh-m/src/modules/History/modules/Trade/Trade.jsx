import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import Button from 'components/Button'
import TradePer from './modules/TradePer/TradePer'
import TradeGroup from './modules/TradeGroup/TradeGroup'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)
class Trade extends Page {
  constructor () {
    super();

    /*this.tabConfig = {
        fields: [
        {
          title: '个人记录',
        content: <TradePer />
        },
        {
          title: '团队记录',
          content: <TradeGroup />
        }
      ]
    };*/
  }

  render () {
    let children = this.props.children
    return children ? children :(
      <TradePer />
    )
  }
}

module.exports = Trade