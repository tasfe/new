import React from 'react'
import Page from 'base-page'
import withStyles from 'with-style'
import styles from './Lotterylist.css'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Lotterylist'
import ResultListItem from 'components/List/Items/MMCResultlist'
import CountingDown from 'components/CountingDown'
import Button from 'components/Button'
import { setTitle } from 'redux/modules/toolbar'
import { order, mmc, reset as resetBetting } from 'redux/modules/Lottery/betting'
import { chase, reset as resetChase } from 'redux/modules/Lottery/chase'
import Link from 'react-router/lib/Link'
import Header from '../../components/Header'
import ChaseBar from './components/ChaseBar'
import Fhmmc from './components/Fhmmc'
import { setLeftButton } from 'redux/modules/toolbar'
import MMCFooter from '../../components/MMC/Footer'

@withStyles(styles)
@connect(state => ({
  list: state.betting.previewList,
  lotteryInfo: state.lottery.lottery,
  totalInfo: state.betting.totalInfo,
  previewList: state.betting.previewList,
  chasePlanList: state.chase.chasePlanList,
}), {
  setTitle,
  order,
  chase,
  mmc,
  resetBetting,
  resetChase,
  setLeftButton
})
class Lotterylist extends Page {
  constructor () {
    super()

    this.loading = false
    this.suspend = true
    this.isChase = false
    this.succession = 1
    this.isBegin = false;

    this.state = {
      startOpen: '',
      leftTime: 1,
      cease: false,
      winPrize: 0,
      mmcResult: []
    }
  }

  componentDidMount () {
    this.props.setTitle('号码篮')
    this.props.setLeftButton(true);
  }

  actionRespond (done, resp) {
    this.loading = false

    let actionType = this.isChase ? '追号' : '投注'

    window.Alert({
      noCancel: true,
      title: done ? '恭喜': '错误',
      type: 'confirm',
      content: done ? `${actionType}成功` : (resp.msg || `${actionType}失败`),
      callback : () => {
        if (done) {
          this.props.resetBetting()
          this.props.resetChase()
          window.history.back()
        }
      }
    })
  }

  mmcRespond (done, resp) {
    this.loading = false

    window.Alert({
      noCancel: true,
      title: done ? '提示': '错误',
      type: 'confirm',
      content: done ? (this.succession > this.state.leftTime ? '正在进入下一轮开奖...' : '投注成功,等待开奖') : (resp.msg || '投注失败'),
      callback : () => {
        if (done) {
          // this.props.resetBetting()
          // this.props.resetChase()
          this.setState({
            startOpen: true,
            leftTime: this.state.leftTime-1
          });
          this.getStart(resp.root)
        }
      }
    })
  }

  doSomething () {
    if (this.loading) return
    this.loading = true
    let { previewList, chasePlanList, lotteryInfo, chase, order, mmc } = this.props
    
    if (this.props.location.state.id == 19) {
      mmc('mmc', ::this.mmcRespond);
    } else if ((chasePlanList || []).length > 1) {
      chase({
        suspend: this.suspend,
        previewList,
        chasePlanList,
      }, ::this.actionRespond)
    } else {
      order(lotteryInfo.planId, ::this.actionRespond)
    }
  }

  updateSuspendState (state) {
    this.suspend = state
  }

  updateSuccession(count) {
    this.succession = count
    this.setState({
      leftTime: this.succession
    })
  }

  getStart (res) {
    var self = this;
    if(this.isBegin) return false;
    this.isBegin = true;
    $(".mmc-num").css('backgroundPositionY','-0.06rem');
    if(!$('.js-bc-mmc-start').hasClass('active')){
      $('.js-bc-mmc-start').addClass('active');
      //this.startAnimate();
      setTimeout(function(){
        $('.js-bc-mmc-start').removeClass('active');
      }, 1000);
      var result = res.openCode;
      var u = 0.56;
      var num_arr = (result+'').split(',');
      console.log(result)
      $(".mmc-num").each(function(index){
        var _num = $(this);
        setTimeout(function(){
          _num.animate({
            'backgroundPositionY': ((u*60) - (u*num_arr[index])) + 1.16 + 'rem'
          },{
            duration: 6000+index*3000,
            easing: "easeInOutCirc",
            complete: function(){
              if(index==4) {
                self.isBegin = false;
                self.setState({
                  winPrize: res.winPrize,
                  mmcResult: res.openResultList
                });
                self.checkLeftTime()
              }
            }
          });
        }, index * 300);
      });
    }
  }

  checkLeftTime () {
    var self = this
    if (this.suspend && this.state.winPrize || this.state.cease) {
      return false
    }
    if (this.state.leftTime >0 ) {
      setTimeout(function(){
        self.setState({
          startOpen: true,
          winPrize: 0,
          mmcResult: []
        });
        self.doSomething()
      }, 2000)
    }
  }

  doSomethingAgain () {
    this.setState({
      startOpen: '',
      cease: false,
      leftTime: 1,
      winPrize: 0,
      mmcResult: []
    });
    this.succession = 1;
    this.doSomething()
  }

  rebetting () {
    this.props.resetBetting()
    window.history.back()
  }

  cease () {
    this.setState({
      cease: true
    });
  }
  
  render () {
    let self = this
    let { totalInfo, list, chasePlanList = [] } = this.props
    let chaseNumber = chasePlanList.length || 1
    this.isChase = chaseNumber > 1
    let totalMoney = chaseNumber > 1 ? _(chasePlanList).last().statisticsMoney : totalInfo.totalMoney

    if (!list.length) {
      return <p style={{textAlign: 'center'}}>号码蓝为空，请返回添加号码后重试</p>
    }

    if (this.state.mmcResult.length) {
      _(list).each(function (item, index) {
        item.winNum = self.state.mmcResult[index].winNum
        item.result = self.state.mmcResult[index].winPrize ? '中奖'+_(self.state.mmcResult[index].winPrize ).convert2yuan()+'元' : '未中奖'
      })
    }

    return  <div className="preview-list-page">
      {this.props.location.state.id == 19 ? '' : <Header />}        
      <div className="lotlist-con">
        {this.props.location.state.id == 19 ? <Fhmmc /> : ''}
        {this.props.location.state.id == 19 && this.state.startOpen && !this.state.mmcResult.length ? <div className="startOpening-img">
          <div className="opening-count">第{this.succession-this.state.leftTime}/{this.succession}期 开奖中</div>
          <img src={require("images/mmc/mmc_win_curr.png")} />
          <div className="opening-text">正在开奖中，祝您好运</div>
        </div> : <span />}
        {this.props.location.state.id == 19 && this.state.startOpen && this.state.mmcResult.length && !this.state.winPrize? <div className="startOpening-img">
          <div className="opening-count">第{this.succession-this.state.leftTime}/{this.succession}期 已结束</div>
          <img className="lost-img" src={require("images/mmc/mmc_lost.png")} />
          <img src={require("images/mmc/mmc_lost1.png")} />
          <div className="opening-text">这局没中，再来一局...</div>
        </div> : <span />}
        {this.props.location.state.id == 19 && this.state.startOpen && this.state.mmcResult.length && this.state.winPrize? <div className="startOpening-img">
          <div className="opening-count">第{this.succession-this.state.leftTime}/{this.succession}期 已结束</div>
          <img src={require("images/mmc/mmc_win_end.png")} />
        </div> : <span />}
        {this.props.location.state.id == 19 && this.state.startOpen || this.state.mmcResult.length ? <List data={list} item={ResultListItem} claxx="iForm-list" itemClass="lotlist-con-li" /> : <List data={list} item={ListItem} claxx="iForm-list" itemClass="lotlist-con-li" />}
      </div>
      {
        this.state.startOpen ? <span /> : <div className="control-area">
          <div className="empty">
            <i className="fa fa-trash-o" /> 清空
          </div>
          {
            this.props.location.state.id == 19 ? <MMCFooter update={::this.updateSuspendState} succession={::this.updateSuccession} /> : <ChaseBar update={::this.updateSuspendState} />
          }
          <div className="summary">
            <span className="summary__text">{`${totalInfo.totalLottery}注 x ${chaseNumber}期 = ${_(totalMoney).convert2yuan()}元`}</span>
            <a className="summary__button" onClick={::this.doSomething}><img src={require("images/icon/hammer.png")} /> {this.isChase ? '追号' : '投注'}</a>
          </div>
        </div>
      }
      {
        (((this.suspend && this.state.winPrize) || !this.state.leftTime) || this.state.cease) && this.state.mmcResult.length ? <div className="control-area button-group">
          <Button config={{
              text: '再玩一次',
              className: 'btn-black waves-light btn-middle'
            }} onClick={::this.doSomethingAgain} />
          <Button config={{
              text: '重新选号',
              className: 'btn-red waves-light btn-middle'
            }} onClick={::this.rebetting} />
        </div> : <span />
      }
      {
        this.props.location.state.id == 19 && this.state.startOpen && this.state.leftTime && !(this.suspend && this.state.winPrize) && !this.state.mmcResult.length ? <div className="control-area button-group">
          <Button config={{
              text: this.state.cease ? '停止中' : '立即停止',
              className: 'btn-black waves-light btn-middle',
              disabled: this.state.cease
            }} onClick={::this.cease} />
        </div> : <span />
      }
    </div>
  }

}

module.exports = Lotterylist