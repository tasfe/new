import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'


@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class TradeGroup extends Page {

  constructor () {
    super()

    this.formatDate = new Date().toString();

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
        title: '彩种名称',
        name: 'ticketName'
      }, {
        title: '已追/总期数',
        name: '',
        format: (value, data) => {
          return data.chaseBetCount +'/'+data.chaseAllPeriods
        }
      }, {
        title: '已投/总金额',
        name: '',
        format: (value, data) => {
          return _(data.chaseBetMoney).convert2yuan() +'/'+_(data.chaseAllMoney).convert2yuan()
        }
      }, {
        title: '中奖余额',
        name: 'chasePrizeMoney',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }, {
        title: '追号状态',
        name: '',
        format: (value, data) => {
          var status = '进行中'
          switch(data.chaseStatus) {
            case 0:
              status = '未开始';
              break;
            case 1:
              status = '进行中';
              break;
            case 2:
              status = '已完成';
              break;
            case 3:
              status = '已中止';
              break;

          }
          return status
        }
      }, {
        title: '追号时间',
        name: '',
        format: (value, data) => {
          return new Date(data.chaseTime).toString('yyyy-MM-dd HH:mm:ss')
        }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      command: [{
        text: '查看详情',
        link: (data) =>{
          return '#/history/trade/detail/' + data.ticketTradeNo
        }
      }],
     transport: {
        parse: data => {
          return data.chaseList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          return {url:'/ticket/bethistory/userchasehistory.json', data: {
          subUser: 1,
          startTime: d+' 00:00:00',
          endTime: defaulEndtDate,
          chaseStatus:-1,
          pageIndex:0,
          userId:_.getQuery('id'),
          username:_.getQuery('name'),
          pageSize:10
        }}} // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '追号时间(起)',
        name: 'startTime',
        validation: {
          rules: ['required'],
          errorMsg: '必填项哦'
        },
        readonly: true,
        class: 'datetime-input-start',
        defaultValue:  defaultStartDate
      }, {
        text: '追号时间(止)',
        name: 'endTime',
        class: 'datetime-input-end',
        readonly: true,
        defaultValue:  defaulEndtDate
      }, {
        text: '订单号',
        name: 'tradeNo'
      }, {
        type: 'select',
        text: '追号状态',
        name: 'chaseStatus',
        selection: [{
         value: '-1',
         option: '全部'
        }, {
         value: '0',
         option: '未开始'
       }, {
         value: '1',
         option: '进行中'
       }, {
         value: '2',
         option: '已完成'
       }, {
         value: '3',
         option: '已中止'
       }]
      }, {
        text: '账号',
        name: 'username',
        defaultValue: _.getQuery('name') ? _.getQuery('name') : ''
      }]
    }

  }

  componentDidMount () {
    this.props.setTitle('追号记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = TradeGroup