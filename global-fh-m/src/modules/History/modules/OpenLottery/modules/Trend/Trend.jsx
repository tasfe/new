import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'
import withStyles from 'with-style'
import styles from './Trend.css'

@connect(
  state => ({}),
  actions
)

@withStyles(styles)

class Trend extends Page {

  constructor () {
    super()

    this.tableConfig = {
      className: 'trend-table',
      columns: [{
        title: '期号',
        name: 'ticketPlanId',
        format: (value, data) => {
          return value
        }
      }, {
        title: '开奖号码',
        name: 'ticketOpenNum',
        format: (value, data) => {
          var newValue = '';
          value = value.split(',');
          value.map(item => {
            newValue += '<div class="trend-openNum">'+ item + '</div>';
          });
          return newValue;

        }
      }],
      transport: {
        parse: data => {
          return data.openedList || []
        },
        read: () => {return {url:'/ticket/ticketmod/trend.json', data: {
          ticketId: this.props.params.id
        }}} // url or function with all callback param
      }
    }
  }

  componentDidMount () {
    this.loaded()
    this.props.setTitle('开奖走势')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = Trend