import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { remove } from 'redux/modules/Lottery/betting'

@connect(state => ({
  list: state.betting.previewList
}), {
  remove
})
class Lotterylist extends Component {
  
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
        <a className="lotlist-con-del" data-index={index} onClick={::this.remove}><i className="fa fa-times-circle"></i></a>
      </div>
    )
  }

  remove (e) {
    let index = Number(e.target.dataset.index)
    this.props.remove(index)
  }
}

export  default Lotterylist