import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import WithStyles from 'with-style'
import styles from './ChaseDetailItem.css'


@WithStyles(styles)
class ChaseDetailItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data;

    return (
      <a className="chase-detail-item-a " href={ "#/history/betting/detail/" + data.tradeId }>
        <div className="chase-detail-item-left">
          <div className="chase-detail-item-left-1">
            <span className="chase-detail-item-plan">{data.ticketPlanId.slice(4)}期</span>
          </div>
          <div className="chase-detail-item-left-2">
            <span className="chase-detail-item-amount">￥{_(data.amount).convert2yuan()}元</span>
          </div>
        </div>
        <div className="chase-detail-item-right">
          <div className="chase-detail-item-status" dangerouslySetInnerHTML={{__html: this.format(data)}}></div>
        </div>
      </a>
    )
  }

  format( data){
    var status = '';
    if(data.planStatus === 4){
      status = '未开始';
    }else if(data.planStatus === 2){
      status = '用户撤单';
    }else if(data.planStatus === 3){
      status = '系统撤单';
    }else if(data.hasException) {
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
      status =  '<div class="chase-detail-item-prize">' + _(data.money).convert2yuan() + "</div>";
    }
    return status;
  }
}

export  default ChaseDetailItem