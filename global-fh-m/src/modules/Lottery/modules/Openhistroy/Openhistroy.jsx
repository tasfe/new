import React from 'react'
import Page from 'base-page'
import withStyles from 'with-style'
import styles from './Openhistroy.css'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Link from 'react-router/lib/Link'
import List from 'components/List'
import ListItem from 'components/List/Items/Openhistroy'
import ticketConfig from 'misc/ticketConfig'
import ticketConfigImg from 'misc/ticketImgConfig'
import CountingDown from 'components/CountingDown'
import { loadLottery } from 'redux/modules/Lottery/lottery'
import styles2 from 'components/Button/Button.css'

@withStyles(styles)
@withStyles(styles2)
@connect(state => ({
  lotteryInfo: state.lottery.lottery,
  title: state.toolbar.title,
  lotteryConfig: state.lottery.lotteryConfig
}), {
    setTitle,
    loadLottery
  } )
class Openhistroy extends Page {

  constructor() {
    super()
    //this.refreshId = window.keyGenerator()
    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.setTitle('开奖号码')
    this.ticketId = this.props.location.state ? this.props.location.state.id : this.props.lotteryConfig.info.id
    if(this.props.id!=='19'){
      this.props.loadLottery({
        data: {
          ticketId: this.ticketId
        }
      })
      this.getOpenHistory()
    }

  }

  getOpenHistory () {
    let pageSize = 20
    if(ticketConfig.getComplete(this.ticketId) && ticketConfig.getComplete(this.ticketId).id === 'ssc'){
      pageSize = 30
    }else if(ticketConfig.getComplete(this.ticketId) && ticketConfig.getComplete(this.ticketId).id === 'num'){
      pageSize = 84
    }

    ajax({
      url: '/ticket/ticketmod/openhistory.json',
      data: {
        pageSize:30,
        ticketId: this.ticketId
      }
    }, resp => {
      this.setState({
        data: resp.root.openedList || []
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  /*componentWillReceiveProps (nextProps) {
    if (nextProps.lotteryInfo !== this.props.lotteryInfo) {
      this.refreshId = window.keyGenerator()
    }
  }*/

  updateList () {
    this.getOpenHistory();
  }

  render () {
    let { lotteryInfo, lotteryConfig } = this.props
    
    return  (
      <div className="lotlist-con">
        <div className="lotlist-top">
          <div className="lotlist-top-img"><img src={ticketConfigImg.get(+this.ticketId) && ticketConfigImg.get(+this.ticketId).img} /></div>
          <div className="lotlist-cd">
            <CountingDown
              time={lotteryInfo.totalSecond}
              left={lotteryInfo.sale ? lotteryInfo.leftSecond : 0}
              loop={!!lotteryInfo.sale}
              format="H:M:S"
              callback={::this.updateList}
              />
          </div>
          <div className="lotlist-btn-con"><Link className="waves-effect btn btn-red waves-light lottery-bet-btn" to={`/lottery/${this.ticketId}`}>立即投注</Link></div>
        </div>
        <List data={this.state.data} item={ListItem} claxx="iForm-list" itemClass="" />
      </div>
    )
  }
}

module.exports = Openhistroy