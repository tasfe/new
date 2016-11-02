/**
 * 投注页 页脚
 */

import React, { Component, PropTypes} from 'react'
import Link from 'react-router/lib/Link'
import NumberRange from '../NumberRange'
import { set as setBetting, add } from 'redux/modules/Lottery/betting'
import { connect } from 'react-redux'
import { loadLottery } from 'redux/modules/Lottery/lottery'
import { loadMMCLottery } from 'redux/modules/Lottery/lottery'

@connect(state => ({
  lotteryInfo: state.lottery.lottery,
  statistics: state.betting.statistics,
  prefabMoney: state.betting.prefabMoney,
  list: state.betting.previewList,
  multiple: state.betting.multiple,
}), {
  setBetting,
  add,
  loadLottery,
  loadMMCLottery
})
class Footer extends Component {

  componentDidMount () {
    this.props.loadMMCLottery({
      data: {
        ticketId: this.props.id
      }
    })

  }

  render () {
    let { lotteryInfo, statistics, prefabMoney, list, multiple } = this.props
    return <div className="bottom-area">
      <div className="bet-area-opt-group">
        <div className="bet-area-line">
          <div className="bet-show">
            <span>{statistics}注 x {multiple || 0}倍 = {_(prefabMoney).convert2yuan() || 0}元</span>
          </div>
          <div className="bet-show">
            <NumberRange />
          </div>
        </div>
        <div className="bet-area-line">
          <div className="bet-show bet-opt-btn">
            <img src={require("/images/icon/fh-add-number.png")} alt="添加号码"/>
            <a className={cx({
            'more-history-numbers': true,
            disabled: !lotteryInfo.sale || !this.props.statistics
          })} onClick={::this.add}> 添加号码</a>
          </div>
          <div  className="bet-opt bet-opt-btn">
            <img src={require("/images/icon/fh-shopping-cart.png")} alt="号码篮"/>
            <Link to={{
              pathname: `/lottery/${this.props.id}/lotterylist`,
              state: {
                id: this.props.id
              }
            }} className={cx({
              addLot: true,
              'more-history-numbers': true,
              disabled: !lotteryInfo.sale || !this.props.list.length
            })}> 号码篮</Link>
            <span className={cx({
              badge: true,
              hidden: !list.length
            })}>{list.length > 99 ? '99+' : list.length}</span>
          </div>
        </div>
      </div>
    </div>
  }

  add () {
    this.props.add()
  }
}

export default Footer
