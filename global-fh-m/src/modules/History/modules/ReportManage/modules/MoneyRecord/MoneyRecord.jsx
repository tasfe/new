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

class MoneyRecord extends Page {

  constructor(props) {
    super(props);

    this.tableConfig = {
      className: 'report-table',
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
        name: 'profitAndLoss',
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
          if (data.amountList) {
            if ((data.betTotal ==0 || data.betTotal) && (data.profitAndLossTotal ==0 || data.profitAndLossTotal)) {
              data.amountList.push({
                userName: '总计',
                bet: data.betTotal,
                profitAndLoss: data.profitAndLossTotal
              })
            }
          }
          return data.amountList || []
        },
        read:() => {
          return {
            url: '/fund/fundreport/profitdetail.json',
            data: {
              startTime: props.config.startTime,
              endTime: props.config.endTime,
              sortFlag: 6,
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

module.exports = MoneyRecord