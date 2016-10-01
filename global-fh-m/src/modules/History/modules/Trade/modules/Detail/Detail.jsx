import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Detail.css'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'
import { setLeftButton } from 'redux/modules/toolbar'
import ticketConfig from 'misc/ticketImgConfig'
import { setRightButton } from 'redux/modules/toolbar'
import List from 'components/List'
import ListItem from 'components/List/Items/ChaseDetailItem'

@connect(state => ({
  title: state.toolbar.title,
  user: state.auth.user
}), { setTitle,
  setLeftButton,
  setRightButton})
@WithStyles(styles)
class Detail extends Page {

  constructor() {
    super()

    this.state = {
      data: []
    }

    this.tableConfig = {
      columns: [{
        title: '奖期',
        name: 'ticketPlanId'
      }, {
        title: '开奖号码',
        name: 'ticketResult'
      }, {
        title: '倍数',
        name: 'betMultiple'
      }, {
        title: '投注金额',
        name: 'amount',
        format: (value,data) => {
          return '<span class="bet-redcl">' + _(value).convert2yuan()+ "</span>";
        }
      }, {
        title: '状态',
        name: '',
        format: (value, data) => {
          var status = '';
          if(data.planStatus === 4){
            status = '未开始';
          }else if(data.planStatus === 2){
            status = '用户撤单';
          }else if(data.planStatus === 3){
            status = '系统撤单';
          } else if(data.hasException) {
              status = '等待开奖';
          }else if(data.ticketResult === null) {
            if(data.ticketOpenStatus>0){
              status = '未中奖';
            }else {
              status = '等待开奖';
            }
          } else if(data.money === 0) {
            status = '未中奖';
          } else {
            status =  '<span class="bet-redcl">' + _(data.money).convert2yuan() + "</span>";
          }
          return status;
        }
      }],
      command: [{
        text: '查看',
        visible: data => {
          return !!data.tradeId
        },
        link: (data) => {
          if(_.getQuery('id')){
            return (data.tradeId ? ('#/history/betting/detail/' + data.tradeId+'?id='+_.getQuery('id') + '&name='+_.getQuery('name')) : 'javascript:void 0')
          }else{
            return (data.tradeId ? ('#/history/betting/detail/' + data.tradeId) : 'javascript:void 0')
          }
        }
      }, {
        text: '撤销',
        visible: data => {
          return data.canCancel && (_.getQuery('id') ? _.getQuery('id')==this.props.user.root.userId : true)
        },
        click: (data, e) => {
          this.stopChase({
            chasePlanId: data.chasePlanId
          }, e)
        }
      }],
      transport: {
        parse: data => {
          return data.chaseTicketPlanDetail || data || []
        }
      }
    }
  }

  read () {
    var data = {
      tradeNo: this.props.params.id
    }
    if(_.getQuery('id')){
      data = $.extend(true, data, {userId:_.getQuery('id')})
    }
    ajax({
      url: '/ticket/chase/detail.json',
      data: data
    }, resp => {
      this.setState({
        data: resp.root
      })
    })
  }

  componentDidMount() {
    this.props.setLeftButton(true);
    this.props.setTitle('追号详情');
    this.props.setTitle((_.getQuery('name') ? _.getQuery('name')+'的' : '') + '追号详情')
    this.read()
  }

  stopChase (data, e) {
    ajax({
      url: '/ticket/chase/cancel.json',
      data: $.extend({
        chaseId: this.state.data.chaseFormId
      }, data)
    }, () => {
      window.Alert({
        content: '操作成功'
      })
      this.read()
    })

    e.stopPropagation()
    return false
  }

  canCancel (data) {
    return data ? data.some(item => {
      return item.canCancel
    }) : false
  }

  render() {
    let data = this.state.data
    let ctpd = data.chaseTicketPlayDetail
    let canCancel = this.canCancel(data.chaseTicketPlanDetail)
    let config = ticketConfig.get(data.ticketId) || {};
    if(canCancel && (_.getQuery('id') ? _.getQuery('id')==this.props.user.root.userId : true)){
      this.props.setRightButton(<li><a onClick={this.stopChase.bind(this, null)} className="checkchase">终止追号</a></li>);
    }else{
      this.props.setRightButton('');
    }

    let props = {
      data: data.chaseTicketPlanDetail||[],
      item: ListItem,
      claxx: 'chase-detail-item-list',
      itemClass: 'chase-detail-item',
      childrenField: 'list'
    };
    return (
      <div>{ data.chaseTicketPlayDetail && 
        <ul className = "list iForm-list bet-detail-form">
          <li className = "list-item">
            <div className="chase-detail-left">
              <img className="chase-detail-icon" src={config.img}/>
            </div>
            <div className="chase-detail-right">
              <div className="chase-detail-row1">
                <div className="chase-detail-name">{data.ticketName} </div>
              </div>
              <div className="chase-detail-row2">
                <div className="chase-detail-period">
                  <div>已追{ data.chasePeriods?data.chasePeriods: '0'}期&nbsp;&nbsp;共{data.chaseAllPeriods  }期</div>
                </div>
                <div className="chase-detail-status">
                  <div>当前状态:{ this.getStatus(data.chaseStatus) }</div>
                </div>
              </div>
            </div>
          </li>
          <li className = "list-item">
            <div>追号时间：</div><div>{ data.chaseTime ? new Date(data.chaseTime).toString('yyyy-MM-dd HH:mm:ss') : '' }</div>
          </li>
          <li className = "list-item">
            <div>追号编号：</div><div>{data.chaseFormNo}</div>
          </li>
          <li className = "list-item">
            <div>追停条件：</div><div>{data.suspend && (data.suspend ? '追中即停' : '不停止') }</div>
          </li>
          <li className = "list-item">
            <div>中　　奖：</div><div className='bet-redcl'>{data.money?(_(data.money).convert2yuan()+'元'):'未中奖'}</div>
          </li>
        </ul>}
        {/*<div className = "chase-tbl"> <Table data={data} config = { this.tableConfig }> </Table> </div>*/}
        <div className="chase-detail-check">查看追号方案</div>
        <div>
          <List {...props} />
        </div>
      </div>
    )
  }

  getStatus(chaseStatus){
    let status ='';
    switch(chaseStatus) {
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

    return status;
  }
}

module.exports = Detail