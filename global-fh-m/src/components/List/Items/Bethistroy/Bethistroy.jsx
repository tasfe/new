import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class Bethistroy extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data
    var status = '';
    if(data.ticketBetStatus === 2) {
      status = '用户撤单';
    } else if (data.ticketBetStatus === 3) {
      status = '系统撤单';
    } else if(data.hasException){
        status = '等待开奖';
    }else if(data.ticketResult === null) {
      if(data.ticketOpenStatus>0){
        status = '未中奖';
      }else {
        status = '等待开奖';
      }
    } else if (data.prizeTotalMoney === 0) {
      status = '未中奖';
    } else {
      status = '<span class="bet-redcl">' + _(data.prizeTotalMoney).convert2yuan() + "</span>";
    }
     return (
      <a className="iForm-list-inner arrow" href={ "#/history/betting/detail/" + data.ticketTradeNo }>
        <span className="bh-span">{data.ticketPlanId.slice(4)}</span>
        <span className="bh-span">{_(data.betTotalMoney).convert2yuan()}</span>
        <span className="bh-span" dangerouslySetInnerHTML={{__html: status}}></span>
      </a>
      
    )
  }
}

export  default Bethistroy