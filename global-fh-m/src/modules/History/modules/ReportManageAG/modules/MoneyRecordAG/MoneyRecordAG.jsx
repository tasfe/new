import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import moneyStyles from './MoneyRecord.css'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'

@connect(state => ({}), {...actions, filter})

@withStyles(moneyStyles)

class MoneyRecordAG extends Page {

  constructor(props) {
    super(props);

    this.tableConfig = {
      className: 'reportAG-table',
      columns: [{
        title: '用户名',
        name: 'userName'
      }, {
        title: '销量',
        name: 'bet',
        format: (value, data) => {
          return _.convert2yuan(value);
        }
      }, {
        title: '盈亏',
        name: 'profit',
        format: (value, data) => {
          if (value > 0) {
            return '<span class="text-green">+'+ _.convert2yuan(value) + '</span>';
          } else {
            return '<span class="text-red">'+ _.convert2yuan(value) + '</span>';
          }
        }
      }],
      transport: {
        parse: data => {
          if (data.dataList) {
            if ((data.total.bet ==0 || data.total.bet) && (data.total.profit ==0 || data.total.profit)) {
              data.dataList.push({
                userName: '总计',
                bet: data.total.bet,
                profit: data.total.profit
              })
            }
          }
          return data.dataList || []
        },
        read:() => {
          return {
            url: '/ticket/bethistory/agProfitLossReport.json',
            data: {
              subUser: 2,
              startTime: props.config.startTime,
              endTime: props.config.endTime,
              pageSize: 100,
              pageIndex: 0
            }
          }
        }
      }
    };

    this.tableId = window.keyGenerator();
  }

  componentWillReceiveProps(nextProps) {

  }

  componentDidMount() {

  }

  render() {

    return (
      <div>
        <Table id={this.tableId} config={this.tableConfig} />
        {
          //this.props.children || <List {...props} />
        }
      </div>
    )
  }

}

module.exports = MoneyRecordAG