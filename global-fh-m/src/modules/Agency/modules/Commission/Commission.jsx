import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Commission.css'
import Table from 'components/Table'
import Loss from './modules/Loss/Loss'
import Consum from './modules/Consum/Consum'


@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)

class Commission extends Page {
  constructor () {
    super();

    this.tabConfig = {
      fields: [
        {
          title: '消费佣金',
          content: <Consum />
        },
        {
          title: '亏损佣金',
          content: <Loss />
        }
      ]
    };

  }

  componentDidMount () {
    this.props.setTitle('佣金统计');
    this.loaded();
  }

  render () {
    return (
      <Tab config = {this.tabConfig} />
    )
  }
}

module.exports = Commission