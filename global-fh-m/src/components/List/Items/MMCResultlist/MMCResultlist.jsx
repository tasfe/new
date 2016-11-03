import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect(state => ({
  list: state.betting.previewList
}), {})
class MMCResultlist extends Component {
  
  static propTypes = {
    data: PropTypes.object.isRequired,
    index: PropTypes.number
  }

  render () {
    let { data, index } = this.props

    return (
      <div className="lotlist-con-item">
        <span className="iForm-list-inner">{`${data.formatBettingNumber.replace(/,/g, ' | ')}`}</span>
        <span className="iForm-list-inner">{`[${data.playName}] ${data.statistics}注 x ${data.multiple}倍 = ${_(data.prefabMoney).convert2yuan()}元`}</span>
        {
          data.winNum == 1 ? <span className="lotlist-con-res text-red" data-index={index}>{data.result}</span> : <span className="lotlist-con-res" data-index={index}>{data.result ? data.result : '开奖中' }</span>
        }
      </div>
    )
  }
}

export  default MMCResultlist