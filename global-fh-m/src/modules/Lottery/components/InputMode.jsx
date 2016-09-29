/**
 * 任选单式玩法 组件
 */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { set } from 'redux/modules/Lottery/betting'
import Optionals from './Optionals'

@connect(state => ({
  adding: state.betting.adding
}), { set })
class InputMode extends Component {

  static propTypes = {
    playMode: PropTypes.object.isRequired
  }

  constructor () {
    super()

    this.splitReg = /[\r\n,\;:\|\s]+/
  }

  componentWillReceiveProps (nextProps) {
    if ('input' === nextProps.playMode.type && nextProps.adding) {
      let bettingInfo = this.getBetting()
      this.props.set({
        add: {
          lotteryList: bettingInfo.passNumbers,
          selectOptionals: this.selectOptionals,
          format: bettingInfo.format,
          type: 'input',
          formatToNum: bettingInfo.formatToNum
        }
      })
    } else if ('input' === nextProps.playMode.type && false === nextProps.adding){
      this.props.set({
        statistics: 0
      })
    }
  }

  render () {
   let { playMode } = this.props
    return (
      <div>
        <Optionals playMode={playMode} onChange={::this.onOptionalsChange} />
        <textarea
          rows="18"
          ref="inputArea"
          className="user-paste-area"
          onChange={::this.onChange}
          placeholder="请将格式化后的文本粘贴至此; 每一注号码之间的间隔符支持 回车 [ 逗号[,] 分号[;] 冒号[:] 竖线 [|]; 最多5000注" />
      </div>
    )
  }

  onChange () {
    this.statisticsLottery()
  }

  onOptionalsChange (selectOptionals, coefficient) {
    this.selectOptionals = selectOptionals
    this.coefficient = coefficient
    this.statisticsLottery()
  }

  getBetting () {
    let repeat = this.checkRepeat(this.split());
    let validate = this.validate(repeat.passNumbers);

    this.props.set({'statistics': validate.statistics});

    repeat.repeatNumbers = repeat.repeatNumbers.concat(validate.repeatNumbers);

    return {
      passNumbers: _(validate.passNumbers).map(function(passNumber) {
        return passNumber.split(',');
      }),
      selectOptionals: this.selectOptionals,
      repeatNumbers: repeat.repeatNumbers,
      errorNumbers: validate.errorNumbers
    };
  }

  checkRepeat (numberList) {
    let results = _(numberList).unique()

    return {
      passNumbers: results.unique,
      repeatNumbers: results.repeat
    }
  }

  split () {
    let contents = $(this.refs.inputArea || '.user-paste-area').val().trim()
    return contents.split(this.splitReg);
  }

  validate (numberList) {
    let result;
    let playMode = this.props.playMode

    if (this.coefficient && playMode.validate) {
      result = playMode.validate.call(playMode, numberList);

      result.statistics = Math.round(_(this.coefficient).mul(result.statistics));
    } else {
      result = {
        statistics: 0
      }
    }

    return result
  }

  statisticsLottery () {
    let validate = this.validate(this.split());
    this.props.set({'statistics': validate && validate.statistics || 0});
  }
}

export default InputMode