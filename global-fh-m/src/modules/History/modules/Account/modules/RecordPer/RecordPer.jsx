import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

class RecordPer extends Page {

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
        name: 'tradeNo',
        width: '19%'
      },{
        title: '交易时间',
        name: '',
        format: (value, data) => {
          return new Date(data.createTime).toString('yyyy-MM-dd HH:mm:ss')
        },
        width: '16%'
      }, {
        title: '交易类型',
        name: 'tradeType',
        width: '15%'
      }, {
        title: '账变',
        name: 'amount',
        format: (value,data) => {
          return _(value).convert2yuan();
        },
        width: '10%'
      }, {
        title: '账户余额',
        name: 'balance',
        format: (value,data) => {
          return _(value).convert2yuan();
        },
        width: '20%'
      },{
        title: '备注',
        name: 'remark',
        width: '20%'
      }],
     
      command: [{
        text: '查看详情',  //交易类型为投注时才有 查看详情
        visible: data => {
          if ( data.remark==='投注扣款'||data.remark==='中奖'||data.remark.indexOf('投注所得')!==-1||data.remark==='用户撤单'||data.remark==='系统撤单') {
            return true
          } else if(data.remark==='追号扣款'||data.remark.indexOf('撤销追号')!==-1) {
            return true
          } else {
            return false
          }
        },
        link: (data) =>{
          if ( data.remark==='投注扣款'||data.remark==='中奖'||data.remark.indexOf('投注所得')!==-1||data.remark==='用户撤单'||data.remark==='系统撤单') {
            if(_.getQuery('id')){
              return '#/history/betting/detail/' + data.tradeNo +'?id='+_.getQuery('id') + '&name='+_.getQuery('name')
            }else{
              return '#/history/betting/detail/' + data.tradeNo
            }
          } else if(data.remark==='追号扣款'||data.remark.indexOf('撤销追号')!==-1) {
            if(_.getQuery('id')){
              return '#/history/trade/detail/' + data.tradeNo +'?id='+_.getQuery('id') + '&name='+_.getQuery('name')
            }else{
              return '#/history/trade/detail/' + data.tradeNo
            }
          } else {
            return 'javascript:void 0'
          }
        }
      }],
      
      transport: {
        parse: data => {
          return data.balanceList || []
        },
        read: () => {
          var d = new Date().toString('yyyy-MM-dd')
          var data = {
            startTime: defaultStartDate + ' 00:00:00',
            endTime: defaulEndtDate,
            pageIndex:0,
            pageSize:10
          }
          if(_.getQuery('id') && _.getQuery('name')){
            data = $.extend(true, data, {userId:_.getQuery('id'), username:_.getQuery('name'),})
          }
          return {url:'/fund/balance/history.json', data: data}
        } // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '投注时间(起)',
        name: 'startTime',
        validation: {
          rules: ['required'],
          errorMsg: '必填项哦'
        },
        class: 'datetime-input-start',
        readonly: true,
        defaultValue:  defaultStartDate
      }, {
        text: '投注时间(止)',
        name: 'endTime',
        class: 'datetime-input-end',
        readonly: true,
        defaultValue:  defaulEndtDate
      }, {
        type: 'select',
        text: '交易类型',
        name: 'tradeType',
        selection: [{
         value: '',
         option: '全部'
        }, {
         value: '10',
         option: '收入'
       }, {
         value: '100',
         option: '充值'
       }, {
         value: '101',
         option: '中奖'
       }, {
         value: '102',
         option: '返点'
       }, {
         value: '103',
         option: '撤单'
       }, {
         value: '104',
         option: '转账（转入）'
       }, {
         value: '105',
         option: '系统加币'
       }, {
         value: '11',
         option: '支出'
       }, {
         value: '106',
         option: '提现'
       }, {
         value: '107',
         option: '投注'
       }, {
         value: '108',
         option: '转账（转出）'
       }, {
         value: '109',
         option: '系统扣币'
       }]
      }, {
        text: '交易流水号',
        name:'tradeNo'
      }]
    }
  }

  componentDidMount () {
    var name = _.getQuery('name')
    this.props.setTitle((name ? name+'的' : '') + '账户明细')
  }

  render () {
    return (<Table config={ this.tableConfig }></Table>)
  }
}

module.exports = RecordPer