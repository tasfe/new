/**
 * 投注页 玩法选择器
 */

import React, { Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { set } from 'redux/modules/Lottery/lottery'
import { set as setBetting } from 'redux/modules/Lottery/betting'
import betRules from 'misc/betRulesConfig'
import { localStore } from 'storeUtil'
import { setTitle } from 'redux/modules/toolbar'
import { setRightButton } from 'redux/modules/toolbar'
import Menu from './Menu'

const userHistoryPlayMode = 'USER_HISTORY_PLAY_MODE'

@connect(state => ({
  lotteryPatterns: state.lottery.lotteryPatterns,
  lotteryConfig: state.lottery.lotteryConfig,
  unit: state.betting.unit
}), {
  set,
  setBetting,
  setTitle,
  setRightButton,
})
class Selector extends Component {
  
  constructor (props) {
    super(props)

    this.state = {
      groupData: [],
      history: [],
    }
  }

  componentDidMount () {
    let { lotteryConfig, lotteryPatterns} = this.props
    this.props.setRightButton(<Menu showHistory={this.props.showHistory} />)

    this.props.setTitle(lotteryConfig.title + '-' + lotteryConfig.info.zhName)

    if (lotteryPatterns) {
      this.setup(lotteryPatterns)
    }
  }

  componentWillReceiveProps (nextProps) {
    // only update selection info when component created
    if (!this.props.lotteryPatterns && nextProps.lotteryPatterns) {
      this.setup(nextProps.lotteryPatterns)
    }
  }

  getGroupedData (data) {
    data = data['ticketPlayLevelInfo']
    if (!data.length) return []

    let groupData = []

    _(data).map(item => {
      Array.prototype.push.apply(groupData, item['ticketPlayGroupInfo'])
    })

    return groupData
  }

  getDefaultPlayInfo () {

    if (this.state.history.length) {
      return this.state.history[0]
    }

    let groupData = this.state.groupData
    let groupIndex = this.props.lotteryConfig.id === 'ssc' ? 12 : 6
    if (groupIndex > (groupData.length - 1)) groupIndex = 0
    let play
    try {
      play = groupData[groupIndex]['ticketPlayInfo'][0]
    } catch (err) {
      Alert({
        title: '错误',
        content: '获取默认玩法数据失败'
      })
    }
    return play
  }

  updatePlayHistory (play) {
    this.setState(() => {
      let history = this.state.history
      let alreadyHave = _(history).findIndex({
        playId: play.playId
      })
      if(-1 !== alreadyHave) {
        history.splice(alreadyHave, 1)
      }
      history.unshift(play)
      if (5 < history.length) {
        history.length = 5
      }
      return {
        history: history
      }
    })
  }

  update (play) {
    play = play || this.getDefaultPlayInfo()

    this.updatePlayHistory(play)

    let playMode = betRules.get({
      playId: play.playId
    })

    this.props.set({
      playMode: playMode,
      playInfo: play
    })

    this.props.setBetting({
      levelName: '未知',
      playId: play.playId,
      playName: play.playName,
      maxBonus: play.betMethodMax,
      betMethod: 0, //高奖金
      maxMultiple: play.betMultiLimitMax,
      userRebate: play.userRebate
    })

    this.props.setBetting({
      statistics: 0
    })
  }

  setup (lotteryPatterns) {
    this.props.set({
      limitMoney: lotteryPatterns.limitMoney
    })

    let history
    try {
      history = JSON.parse(localStore.get(`${userHistoryPlayMode}/${this.props.id}`) || '0')
    } catch (err) {
      Alert({
        title: '错误',
        content: '解析用户历史玩法数据出错'
      })
    }

    this.setState({
      groupData: this.getGroupedData(lotteryPatterns),
      history: history || []
    }, ::this.update)
  }

  toggleSelectPanel () {
    $(this.refs.VList).slideToggle('fast')
  }

  componentWillUnmount() {
    localStore.set(`${userHistoryPlayMode}/${this.props.id}`, JSON.stringify(this.state.history))  
  }
  
  render () {
    let { history, groupData } = this.state

    return  (
      <div className="play-mode">
        <div className="horizontal-list-container">
          <ul ref="HList" className="horizontal-list">
          {history.map((item, index) => {
            return <li className={cx({
              'play-mode-li': true,
              'current-play-mode': index === 0
            })} key={index} onClick={::this.update.bind(this, item)}>
              {item.playName}
            </li>
          })}
          </ul>
        </div>
        <button className="play-group-list-toggle-button" onClick={::this.toggleSelectPanel}>
          <img src="/images/icon/fh-triangle.png" alt="点击选择玩法"/>
        </button>
        <ul ref="VList" className="play-group-list">
        {groupData.map((item, index) => {
          return <li className="play-group-item" key={index}>
            <span className="play-group-name">{item.playGroupName}</span>
            <ul className="play-mode-list">
            {item.ticketPlayInfo.map((item, index) => {
              return <li 
                className="play-mode-item" 
                key={index}
                onClick={() => {
                  this.toggleSelectPanel()
                  this.update(item)
                }}
              >
                {item.playName}
              </li>
            })}
            </ul>
          </li>
        })}
        </ul>
      </div>
    )
  }

}

export default Selector