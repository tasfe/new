import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'

@connect(
  state => ({
    title: state.toolbar.title,
    user: state.auth.user}),
  actions
)

class TradePer extends Page {

  constructor (props) {
    super(props)

    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    let  defaultStartDate = new Date().toString('yyyy-MM-dd')+' 00:00:00';
    let  defaulEndtDate = new Date((new Date()/1000+86400)*1000).toString('yyyy-MM-dd')+' 00:00:00';
    this.tableConfig = {
      caption: '追号记录只保留最近30天',
      pagable: true,
      columns: [{
        title: '彩种名称',
        name: 'ticketName',
        format: (value, data) => {
          return value
        }
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
        name: 'chaseTime',
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
          if(data.userId && data.userId!=this.props.user.root.userId){
            return '#/history/trade/detail/' + data.ticketTradeNo +'?id='+data.userId + '&name='+ data.userName
          }else{
            return '#/history/trade/detail/' + data.ticketTradeNo
          }
        }
      }],
      transport: {
        parse: data => {
          return data.chaseList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          var data = {
            startTime: d+' 00:00:00',
            endTime: defaulEndtDate,
            chaseStatus:-1,
            pageIndex:0,
            pageSize:10
          }
          if(_.getQuery('id')){
            data = $.extend(true, data, {userId:_.getQuery('id'),username:_.getQuery('name')})
          }
          return {url:'/ticket/bethistory/userchasehistory.json', data: data}
        } // url or function with all callback param
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
        defaultValue:  defaultStartDate,
      }, {
        text: '追号时间(止)',
        name: 'endTime',
        readonly: true,
        class: 'datetime-input-start',
        defaultValue:  defaulEndtDate
      }, {
        text: '追号编号',
        name: 'ticketTradeNo'
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
        type: 'select',
        text: '彩种名称',
        name: 'ticketId',
        selection: [{
         value: '',
         option: '所有彩种'
        }, {
         value: '1',
         option: '重庆时时彩'
       }, {
         value: '2',
         option: '江西时时彩'
       }, {
         value: '3',
         option: '新疆时时彩'
       }, {
         value: '8',
         option: '天津时时彩'
       }, {
         value: '9',
         option: '黑龙江时时彩'
       }, {
         value: '10',
         option: '分分彩'
       }, {
         value: '5',
         option: '山东11选5'
       }, {
         value: '4',
         option: '广东11选5'
       }, {
         value: '11',
         option: '江西11选5'
       }, {
         value: '6',
         option: '福彩3D'
       }, {
         value: '7',
         option: 'P5/P3'
       }, {
         value: '12',
         option: '五分彩'
       }, {
         value: '13',
         option: '三分彩'
       }, {
         value: '14',
         option: '11选5分分彩'
       }, {
         value: '15',
         option: '11选5三分彩'
       }, {
         value: '16',
         option: '福彩3D分分彩'
       }, {
         value: '17',
         option: '福彩3D五分彩'
       }]
      }]
    }
    
  }

  componentDidMount () {
    var name = _.getQuery('name')
    this.props.setTitle((name ? name+'的' : '') + '追号记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = TradePer