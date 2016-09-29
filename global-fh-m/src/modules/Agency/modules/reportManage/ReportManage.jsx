import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './ReportManage.css'
import Personal from './modules/Personal/Personal'
import Team from './modules/Team/Team'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)

class ReportManage extends Page {
  constructor () {
    super();

    this.tabConfig = {
      fields: [
        {
          title: '个人记录',
          content: <Personal />
        },
        {
          title: '团队记录',
          content: <Team />
        }
      ]
    };

  }

  componentDidMount () {
    this.props.setTitle('报表查询');
    this.loaded();
  }

  render () {
    return (
      <Tab config = {this.tabConfig} />
    )
  }
}

module.exports = ReportManage