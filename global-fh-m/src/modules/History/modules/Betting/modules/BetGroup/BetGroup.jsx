import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'


@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class BetGroup extends Page {

  constructor () {
    super()
    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

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
        title: '投注奖期',
        name: 'ticketPlanId'
      }, {
        title: '投注金额',
        name: 'betTotalMoney',
        format: (value,data) => {
          return _(value).convert2yuan();
        }
      }, {
        title: '订单状态',
        name: '',
        format: (value, data) => {
         var status = '';
          if(data.ticketBetStatus === 2) {
            status = '用户撤单';
          }else if(data.ticketBetStatus === 3) {
            status = '系统撤单';
          } else if(data.hasException){
            status = '等待开奖';
          }else  if(data.ticketResult === null) {
            if(data.ticketOpenStatus>0){
              status = '未中奖';
            }else {
              status = '等待开奖';
            }
          } else  if(data.prizeTotalMoney === 0) {
            status = '未中奖';
          } else {
            status = '<span class="bet-redcl">' + _(data.prizeTotalMoney).convert2yuan() + "</span>";
          }
          return status
        }
      }, {
        title: '是否追号',
        name: '',
        format: (value, data) => {
          return data.chaseId  ? '是' : '否'
        }
      }, {
        title: '投注时间',
        name: '',
        format: (value, data) => {
          return new Date(data.betTime).toString('yyyy-MM-dd HH:mm:ss')
        }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      command: [{
        text: '详情',
        link: (data) =>{

          return '#/history/betting/detail/' + data.ticketTradeNo
        },
        dataAttr: (data,index) => {

        },
        onClick: () => {

        }
      }],
      transport: {
        parse: data => {
          return data.betList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          return {
            url:'/ticket/bethistory/userbethistory.json',
            data: {
              subUser: 1,
              startTime: d+' 00:00:00',
              endTime: defaulEndtDate,
              betStatus:-1,
              userId:_.getQuery('id'),
              username:_.getQuery('name'),
              pageIndex:0,
              pageSize:10
            }}} // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '投注时间(起)',
        name: 'startTime',
        readonly: true,
        class: 'datetime-input-start',
        defaultValue:  defaultStartDate,
      }, {
        text: '投注时间(止)',
        name: 'endTime',
        readonly: true,
        class: 'datetime-input-end',
        defaultValue:  defaulEndtDate,
      }, {
        text: '订单号',
        name: 'tradeNo'
      }, {
        type: 'select',
        text: '订单状态',
        name: 'betStatus',
        selection: [{
          value: '-1',
          option: '全部'
        }, {
          value: '0',
          option: '等待开奖'
        }, {
          value: '1',
          option: '已中奖'
        }, {
          value: '2',
          option: '用户撤单'
        }, {
          value: '3',
          option: '系统撤单'
        }, {
          value: '4',
          option: '未中奖'
        }]
      }, {
        text: '账号',
        name: 'username',
        defaultValue: _.getQuery('name') ? _.getQuery('name') : ''
      }]
    }
  }

  componentDidMount () {
    this.props.setTitle('投注记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = BetGroup