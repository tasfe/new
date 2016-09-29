import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class BetRecordItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <a className="bet-item-detail-a " href={ "#/history/Trade/detail/" + data.ticketTradeNo }>
        <div className="bet-item-left">
          <div className="bet-item-left-1">
            <span className="bet-item-name">{data.ticketName}</span>

          </div>
          <div className="bet-item-left-2">
            <span className="bet-item-amount">￥{_(data.betTotalMoney).convert2yuan()}</span>
            <span className="bet-item-plan">{data.ticketPlanId.slice(4)}期</span>
          </div>
        </div>
        <div className="bet-item-right">
          <div><span className="bet-item-status" dangerouslySetInnerHTML={{__html: data.status}}></span></div>
          <div><span className="chase-item-periods">{'追号'+data.chaseBetCount+'/'+data.chaseAllPeriods}</span></div>
        </div>
      </a>

    )
  }
}

export  default BetRecordItem