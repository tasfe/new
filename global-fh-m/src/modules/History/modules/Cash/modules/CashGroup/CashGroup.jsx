import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'


@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class CashGroup extends Page {

  constructor () {
    super()
    let  defaultStartDate = new Date().toString('yyyy-MM-dd')+' 00:00:00';
    let  defaulEndtDate = new Date((new Date()/1000+86400)*1000).toString('yyyy-MM-dd')+' 00:00:00';
    this.tableConfig = {
      pagable: true,
      columns: [{
        title: '账号',
        name: 'userName',
        format: (value, data) => {
          return value
        }
      }, {
        title: '交易流水号',
        name: 'tradeNo'
      }, {
        title: '提现时间',
        name: '',
        format: (value, data) => {
          return new Date(data.createTime).toString('yyyy-MM-dd HH:mm:ss')
        }
      }, {
        title: '金额',
        name: 'amount',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }, {
        title: '余额',
        name: 'balance',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }, {
        title: '状态',
        name: 'status'
      }, {
        title: '备注',
        name: 'remark'
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      transport: {
        parse: data => {
          return data.withdrawList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          return {url:'/fund/withdraw/withdrawlist.json', data: {
          subUser: 1,
          startTime: d+' 00:00:00',
          endTime: d+' 23:59:59',
          pageIndex:0,
          pageSize:10
        }}} // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '提现时间(起)',
        name: 'startTime',
        class: 'datetime-input-start',
        readonly: true,
        defaultValue:  defaultStartDate
      }, {
        text: '提现时间(止)',
        name: 'endTime',
        class: 'datetime-input-end',
        readonly: true,
        defaultValue:  defaulEndtDate
      }, {
        text: '账号',
        name: 'username'
      }]
    }
  }

  componentDidMount () {
    this.props.setTitle('提现记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = CashGroup