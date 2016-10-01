/**
 * 高级追号
 * 该页面目前没有合适的组件可以使用 所以 页面元素占有相当大的篇幅
 * 愚钝之处 还请海涵 :(
 */

import React, { Component, PropTypes } from 'react'
import withStyles from 'with-style'
import styles from './Chase.css'
import NumberRange from 'components/NumberRange'
import Toggle from 'components/Toggles'
import { connect } from 'react-redux'
import { create, setHelper, set as chaseConfig } from 'redux/modules/Lottery/chase'
import { routerActions } from 'react-router-redux'
import { setTitle } from 'redux/modules/toolbar'

@connect(state => ({
  lottery: state.lottery.lottery,
  plans: state.chase.plans,
  maxMultiple: state.chase.maxMultiple,
}), {
  setHelper,
  chaseConfig,
  create,
  pushState: routerActions.push,
  setTitle,
})
@withStyles(styles)
class Chase extends Component {

  constructor (props) {
    super(props)

    this.planId = props.lottery.planId

    this.state = {
      plans: props.plans
    }
  }

  confirmChasePlanList () {
    let params = {}
    _($(this.refs.form).serializeArray()).map(item => {
      params[item.name] = +item.value ? +item.value : item.value
      return item
    })
    if ('multiple' === params.chaseType) {
      this.props.setHelper('normal')
    } else {
      this.props.setHelper('profit')
    }

    this.props.create(params)

    this.props.pushState(`/lottery/${this.props.lottery.ticketId}/chase/confirm`)
  }

  onChangeSuspendState (e) {
    this.props.chaseConfig({
      suspend: e.target.checked
    })
  }

  componentDidMount() {
    this.props.setTitle('高级追号设置')

    if (!this.props.plans.length) {
      ajax({
        url: '/ticket/chase/chaseinfo.json',
        data: {
          ticketId: this.props.lottery.ticketId,
        }
      }, resp => {
        this.props.chaseConfig({
          plans: resp.root,
          suspend: true,
        })
        this.setState({
          plans: resp.root
        })
      }, () => {
        Alert({
          title: '错误',
          content: '追号数据请求失败'
        })
      })
    } else {
      this.kickoffExpiredPlans()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.planId !== nextProps.lottery.planId) {
      this.planId = nextProps.lottery.planId
      this.kickoffExpiredPlans()
    }
  }

  kickoffExpiredPlans () {
    let plans = this.state.plans
    while (plans[0] && plans[0].ticketPlanId !== this.planId) {
      plans.shift()
    }
    this.setState({
      plans
    })
  }

  render () {
    let { children, lottery, maxMultiple, plans } = this.props

    return children ? children : <div className="chase-page">
      <div className="chase-page__header">
        <span>追号设置:</span>
        <div className="pull-right">
          <Toggle config={{
            type: 'checkbox',
            text: '追中即停',
            checked: true,
            onClick: ::this.onChangeSuspendState,
          }} />
        </div>
      </div>
      <div className="chase-page__body">
        <form ref="form">
          <ul className="chase-page__card">
            <li className="card__item">
              <div className="card__item-left card__item-inner">
                <p>起始期号</p>
              </div>
              <div className="card__item-right card__item-inner" ref="planId"><input className="readonly" name="startPlanId" type="text" value={lottery.planId} readOnly /></div>
            </li>
            <li className="card__item">
              <div className="card__item-left card__item-inner">
                <p>追号期数</p>
                <span className="card__item-tip">包含当前期最多可追{(plans || []).length}期</span>
              </div>
              <div className="card__item-right card__item-inner"><NumberRange name="chasePlans" defaultValue={5} max={(plans || [0]).length} /></div>
            </li>
            <li className="card__item">
              <div className="card__item-left card__item-inner">
                <p>起始倍数</p>
                <span className="card__item-tip">最大可投注倍数{maxMultiple}</span>
              </div>
              <div className="card__item-right card__item-inner"><NumberRange name="startMultiple" /></div>
            </li>
          </ul>
          <div className="chase-page__card-title">追号参数:</div>
          <ul className="chase-page__card">
            <li className="card__item">
              <p>翻倍追号</p>
              <div className="card__item-content">
                <Toggle config={{
                  type: 'radio',
                  name: 'chaseType',
                  text: '每隔',
                  value: 'multiple',
                  checked: true
                }} />
                <input type="text" name="gaps" defaultValue="1" />
                期，倍数x
                <input type="text" name="incMultiple" defaultValue="1" />
              </div>
            </li>
            <li className="card__item">
              <p>固定利润率</p>
              <div className="card__item-content">
                <Toggle config={{
                  type: 'radio',
                  name: 'chaseType',
                  text: '利润率',
                  value: 'normalRate'
                }} />
                <input type="text" name="rate" defaultValue="10" />%
              </div>
            </li>
            <li className="card__item">
              <p>分段利润率</p>
              <div className="card__item-content">
                <Toggle config={{
                  type: 'radio',
                  name: 'chaseType',
                  text: '前',
                  value: 'advanceRate'
                }} />
                <input type="text" name="prePlans" defaultValue="5" />期，利润率
                <input type="text" name="preRate" defaultValue="10" />%，之后每期
                <input type="text" name="afterRate" defaultValue="5" />%
              </div>
            </li>
            <li className="card__item">
              <p>固定利润金</p>
              <div className="card__item-content">
                <Toggle config={{
                  type: 'radio',
                  name: 'chaseType',
                  text: '利润金',
                  value: 'normalAmount'
                }} />
                <input type="text" name="amount" defaultValue="100" />元
              </div>
            </li>
            <li className="card__item">
              <p>分段利润金</p>
              <div className="card__item-content">
                <Toggle config={{
                  type: 'radio',
                  name: 'chaseType',
                  text: '前',
                  value: 'advanceAmount'
                }} />
                <input type="text" name="prePlans" defaultValue="5" />期，利润金
                <input type="text" name="preAmount" defaultValue="100" />元，之后每期
                <input type="text" name="afterAmount" defaultValue="50" />元
              </div>
            </li>
          </ul>
        </form>
      </div>
      <div className="chase-page__footer" onClick={::this.confirmChasePlanList}><img src="images/icon/fh-tap.png" alt="点击"/> 生成计划</div>
    </div>
  }
}

module.exports = Chase
