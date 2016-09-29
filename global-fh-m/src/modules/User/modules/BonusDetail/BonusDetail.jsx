import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './BonusDetail.css'
import List from 'components/List'
import ListItem from 'components/List/Items/Bonus'
import ShiShiCai from './modules/ShiShiCai/ShiShiCai'
import FiveOEleven from './modules/FiveOEleven/FiveOEleven'
import LowFrequency from './modules/LowFrequency/LowFrequency'

@connect(state => ({
}),{...actions})

@withStyles(styles)

class BonusDetail extends Page {

  constructor () {
    super();

  }


  componentDidMount () {

    this.props.setTitle('奖金详情');
  }

  render () {

    this.tabConfig = {
      fields: [
        {
          title: '时时彩',
          content: <ShiShiCai />
        },
        {
          title: '十一选五',
          content: <FiveOEleven />
        },
        {
          title: '低频',
          content: <LowFrequency />
        }
      ]
    };

    return (
      <div className="bd-bonusDetail">
        <Tab config = {this.tabConfig} />
      </div>
    )
  }

}

module.exports = BonusDetail