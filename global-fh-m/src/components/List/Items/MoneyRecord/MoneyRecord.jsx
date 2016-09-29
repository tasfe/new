import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import List from 'components/List'
import ListItem from 'components/List/Items/BetRecord/BetRecordItem'
import WithStyles from 'with-style'
import styles from './MoneyRecord.css'


@WithStyles(styles)
class Bethistroy extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data
    let props = {
      data: data.detailList,
      item: ListItem,
      claxx: 'bet-item-detail-list',
      itemClass: 'bet-item-detail-list-item',
      childrenField: 'list'
    };
    console.log(props);

     return (
      <div className="money-item " >
        <div className="money-item-left">
          {_(data.tradeType).getSpecialSrc()!==''&&<img className="money-item-icon" src={_(data.tradeType).getSpecialSrc()}/>}
        </div>
        <div className="money-item-mid">
          {/*<div className="money-item-mid-1">
            <span className="money-item-type">{data.tradeType}</span>
          </div>
          <div className="money-item-mid-2">
            <span className="money-item-date">{data.date}</span>
          </div>*/}
          <div className="money-item-mid-1">{data.tradeType}</div>
          <div className="money-item-mid-2">{data.date }</div>
        </div>
        <div className="money-item-right">
          <span className="money-item-status" dangerouslySetInnerHTML={{__html: _(data.amount).convert2yuanWithColor()}}></span>
        </div>
      </div>
    )
  }
}

export  default Bethistroy