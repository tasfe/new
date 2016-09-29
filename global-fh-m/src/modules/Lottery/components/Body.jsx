/**
 * 投注页 选号
 */

import React, { Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { set } from 'redux/modules/Lottery/betting'
import InputMode from './InputMode'
import Optionals from './Optionals'

@connect(state => ({
  playMode: state.lottery.playMode,
  playInfo: state.lottery.playInfo,
  adding: state.betting.adding
}), { set })
class Body extends Component {

  constructor () {
    super()

    this.rowsResult = []
    this.selectOptionals = []
  }

  onBallClick (e) {
    let $target = $(e.target)
    if ($target.is('.lottery-ball')) {
      this.correctSelect($target)
      $target.toggleClass('active');

      //当是任选并且没有任选位置时，每次改变重新计算系数
      //this.calculateCoefficient();

      this.statisticsLottery();
    }
  }

  onOptionalsChange (selectOptionals, coefficient) {
    this.selectOptionals = selectOptionals
    this.coefficient = coefficient
    this.statisticsLottery()
  }

  correctSelect ($target) {
    let active = $target.is('.active')
    let data = $target.data()

    //横向不允许冲突/超过最大选择数
    if (!active && $target.hasClass('conflict-x')) {
      if (!data.conflictXNum || data.conflictXNum === 1) {
        $target.siblings().removeClass('active');
      } else {
        let $actives = $target.parent().find('.js-bc-select-item.active');
        if ($actives.length >= data.conflictXNum) {
          $actives.eq(0).removeClass('active');
        }
      }
    }

    //纵向不允许冲突
    if (!active && $target.hasClass('conflict-y')) {
      $(this.refs.balls).not($target.parent()).find('.lottery-ball[data-num=' + data.num + ']').removeClass('active');
    }
  }

  statisticsLottery () {
    let count = 0;
    let mode = this.props.playMode

    let rowsResult = this.rowsResult = _(mode.list).map(function(item) {
      let selected = [];

      if (item.isShow) {
        selected = _($(this.refs.balls).find('.ball-line-' + item.id).find('.lottery-ball.active')).map(function(item) {
          return $(item).data('num');
        });
      }

      return selected;
    }, this);

    //如果系数不存在，根本无需计算
    if (this.coefficient) {
      //任选玩法需要去掉没有选值的行，便于复选计算
      if (mode.algorithmProps && mode.algorithmProps.coefficient) {
        count = Math.round(_(this.coefficient).mul(mode.algorithm.call(
            mode,
            _(rowsResult).filter(function(rowResult) {
              return !_.isEmpty(rowResult);
            })) || 0));
      } else {
        count = Math.round(_(this.coefficient).mul(mode.algorithm.call(mode, rowsResult) || 0));
      }
    }
    
    this.props.set({
      statistics: count
    })
    
  }

  componentWillReceiveProps (nextProps) {
    if ('select' === nextProps.playMode.type && nextProps.adding) {
      this.props.set({
        add: {
          lotteryList: this.rowsResult,
          selectOptionals: this.selectOptionals,
          format: this.props.playMode.format,
          type: 'select',
          formatToNum: this.props.playMode.formatToNum
        }
      })
    } else if ('select' === nextProps.playMode.type && false === nextProps.adding){
      this.props.set({
        statistics: 0
      })
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.adding
  }

  render () {
    let { playMode = {}, playInfo = {} } = this.props

    return  (
      <div className="bet-area">
        {playInfo.playExample && <div style={{marginTop: '.1rem', paddingLeft: '.1rem',color:'#FF6700'}}>中奖示例:{playInfo.playExample}</div>}
        {'select' === playMode.type ? <div className="balls" ref="balls">
          <Optionals playMode={playMode} onChange={::this.onOptionalsChange} />
          {playMode.list.map(row => {
            let limit =  _(row.limits).pluck('name').join(' ')
            let other = {}
            _(row.limits).map(function(limit) {
              return _(limit.data).map(function(val, prop) {
                return other['data-' + limit.name + '-' + prop] = val
              })
            })
            return row.isShow ?
              <ul key={window.keyGenerator()} className="lottery-balls" onClick={::this.onBallClick}>
                <li className={'lottery-ball-line ball-line-' + row.id}>
                  <div className="ltball-tt">{row.title || '号码'}</div>
                  <ul>
                    {row.items.map(item => {
                      return <li
                        key={window.keyGenerator()}
                        className={cx({'lottery-ball': true, [limit]: true})}
                        data-num={item}
                        data-row-id={row.id}
                        {...other}>
                        {item}
                      </li>
                    })}
                  </ul>
                </li>
              </ul> : ''
          })}
        </div> : ('input' === playMode.type ? <InputMode playMode={playMode} /> : <span></span>)}
      </div>
    )
  }

}

export default Body
