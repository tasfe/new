import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

class RechargePer extends Page {

  constructor () {
    super()

    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());
    let  defaultStartDate = new Date().toString('yyyy-MM-dd')+' 00:00:00';
    let  defaulEndtDate = new Date((new Date()/1000+86400)*1000).toString('yyyy-MM-dd')+' 00:00:00';
    this.tableConfig = {
      pagable: true,
      columns: [{
        title: '交易流水号',
        name: 'tradeNo'
      }, {
        title: '充值时间',
        name: '',
        format: (value, data) => {
          return new Date(data.createTime).toString('yyyy-MM-dd HH:mm:ss')
        }
      }, {
        title: '充值金额',
        name: 'amount',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }, {
        title: '账户余额',
        name: 'balance',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      
      transport: {
        parse: data => {
          return data.rechargeList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          return {url:'/fund/recharge/rechargelist.json', data: {
          subUser: 0,
          startTime: d+' 00:00:00',
          endTime: d+' 23:59:59',
          pageIndex:0,
          pageSize:10
        }}} // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '充值时间(起)',
        name: 'startTime',
        readonly: true,
        class: 'datetime-input-start',
        defaultValue:  defaultStartDate
      }, {
        text: '充值时间(止)',
        name: 'endTime',
        class: 'datetime-input-end',
        readonly: true,
        defaultValue:  defaulEndtDate
      }]
    }
    
  }

  componentDidMount () {
    this.props.setTitle('充值记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = RechargePer