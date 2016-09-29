import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'

@connect(
  state => ({
    title: state.toolbar.title,
    user: state.auth.user
  }),
  actions
)

class BetPer extends Page {

  constructor () {
    super()

    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    let  defaultStartDate = new Date().toString('yyyy-MM-dd')+' 00:00:00';
    let  defaulEndtDate = new Date((new Date()/1000+86400)*1000).toString('yyyy-MM-dd')+' 00:00:00';
    this.tableConfig = {
      pagable: true,
      columns: [{
        title: '彩种',
        name: 'ticketName',
        width: '18%'
      }, {
        title: '投注奖期',
        name: 'ticketPlanId',
        width: '22%'
      }, {
        title: '投注金额',
        name: 'betTotalMoney',
        format: (value,data) => {
          return _(value).convert2yuan();
        },
        width: '14%'
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
        },
        width: '14%'
      }, {
        title: '是否追号',
        name: '',
        format: (value, data) => {
          return data.chaseId  ? '是' : '否'
        },
        width: '14%'
      }, {
        title: '投注时间',
        name: '',
        format: (value, data) => {
          return new Date(data.betTime).toString('yyyy-MM-dd HH:mm:ss')
        },
        width: '18%'
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      command: [{
        text: '详情',
        link: (data) =>{
          if(data.userId && data.userId!=this.props.user.root.userId){
            return '#/history/betting/detail/' + data.ticketTradeNo +'?id='+data.userId + '&name='+data.userName
          }else{
            return '#/history/betting/detail/' + data.ticketTradeNo
          }
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
          var data = {
            startTime: d + ' 00:00:00',
            endTime: defaulEndtDate,
            betStatus:-1,
            pageIndex:0,
            pageSize:10
          }
          if(_.getQuery('id')){
            data = $.extend(true, data, {userId:_.getQuery('id'),username:_.getQuery('name')})
          }
          return {url:'/ticket/bethistory/userbethistory.json', data: data}
          
        } // url or function with all callback param
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
        text: '订单编号',
        name: 'ticketTradeNo'
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
      }, {
        text: '期号',
        name: 'ticketPlanId'
      }]
    }
    
  }

  componentDidMount () {
    var name = _.getQuery('name')
    this.props.setTitle((name ? name+'的' : '') + '投注记录')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = BetPer