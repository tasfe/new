import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import withStyles from 'with-style'
import styles from './Control.css'
import Button from 'components/Button'
import Toggles from 'components/Toggles'
import ControlNm from './modules/ControlNm/ControlNm'
import ControlPr from './modules/ControlPr/ControlPr'
import { connect } from 'react-redux'
import { chase } from 'redux/modules/Lottery/chase'
import { reset as resetBetting } from 'redux/modules/Lottery/betting'
import { reset as resetChase } from 'redux/modules/Lottery/chase'
import { routerActions } from 'react-router-redux';

@connect(state => ({
  limitMoney: state.lottery.limitMoney,
  ticketInfo: state.lottery.lotteryConfig,
  planId: state.lottery.lottery.planId,
  previewList: state.betting.previewList,
  totalLottery: state.betting.totalInfo.totalLottery,
  chasePlanList: state.chase.chasePlanList,
  chased: state.chase.chased
}), {
  chase, resetBetting, resetChase,
  push: routerActions.push
})
@withStyles(styles)
class Control extends Page {

  constructor (props) {
    super(props)
    
    this.id = 10
    
    let childrenProps = this.getChildProps()

    let prop = {
      ticketId: this.id,
      betParams: childrenProps
    }

    this.tabConfig = {
        fields: [
        {
          title: '普通追号',
          content: <ControlNm {...prop} />
        },
        {
          title: '利润追号',
          content: <ControlPr {...prop} />
        }
      ]
    }

    this.suspend = true

    this.state = {
      loading: false,
    }
  }

  getChildProps () {
    let options = _(this.props).pick('limitMoney', 'ticketInfo', 'planId', 'previewList', 'lotalLottery')

    var params = {
      previewList: [],
      singleType: true,
      maxMultiple: 999999,
      basicBettingMoney: 0,
      basicMaxBonus: 0
    };

    var category = {
      playId: [],
      betMethod: [],
      unit: []
    };

    params.previewList = _(options.previewList).map(function(previewInfo) {
      var info = _({}).extend(previewInfo);
      info.multiple = 1;

      if (previewInfo.maxMultiple < params.maxMultiple) {
        params.maxMultiple = previewInfo.maxMultiple;
      }

      params.prefabMoney = _(previewInfo.prefabMoney).div(previewInfo.multiple);

      params.basicBettingMoney = _(params.basicBettingMoney).add(params.prefabMoney);
      params.basicMaxBonus = _(params.basicMaxBonus).add(_(previewInfo.formatMaxBonus).div(previewInfo.multiple));

      category.playId.push(previewInfo.playId);
      category.betMethod.push(previewInfo.betMethod);
      category.unit.push(previewInfo.unit);

      return info;
    });

    category.playId = _(category.playId).union();
    category.betMethod = _(category.betMethod).union();
    category.unit = _(category.unit).union();

    if (category.playId.length !== 1 || category.betMethod.length !== 1 || category.unit.length !== 1) {
      params.singleType = false;
    }

    _(options).extend(params);

    return options
  }

  render () {

    let { chasePlanList= [] } = this.props
    let last = _(chasePlanList).last() || {}

    return (
      <div className="control control-tabs">
        <Tab config = {this.tabConfig} />
        <div className="control-info">
          <p>追号总期数：{chasePlanList.length}期</p>
          <p>总金额 <span className="red-txt">{_(last.statisticsMoney).convert2yuan()}元</span></p>
        </div>
        <div className="padding-h-sm">
          <div className="control-check">
            <Toggles
              config={{
                type: 'checkbox',
                text: '中奖后停止追号',
                name: 'suspend',
                checked: true
              }}
              onClick={::this.changeSuspend}/>
          </div>
          <Button
            disabled={this.state.loading}
            onClick={::this.chase}
            config={{
              text: '确认投注',
              className: 'btn-red waves-light btn-large'
            }} />
        </div>
      </div>
    )
  }

  changeSuspend (e) {
    this.suspend = e.target.checked
  }

  chase () {
    this.setState({
      loading: true,
    })
    this.props.chase({
      suspend: this.suspend,
      previewList: this.props.previewList,
      chasePlanList: this.props.chasePlanList
    }, () => {
      this.setState({
        loading: false,
      })
      this.props.resetBetting()
      this.props.resetChase()

      window.Alert({
        noCancel: true,
        type: 'confirm',
        noTitle: true,
        content: '恭喜，追号成功',
        callback: () => {
          this.props.push('/lottery/' + this.props.location.state.id)
        }
      })
    })
  }
}

module.exports = Control