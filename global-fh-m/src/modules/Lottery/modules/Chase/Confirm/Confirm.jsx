import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setTitle } from 'redux/modules/toolbar'
import Table from 'components/Table'
import Header from '../../../components/Header'
import { chase, reset as resetChase } from 'redux/modules/Lottery/chase'

@connect(state => ({
  chasePlanList: state.chase.chasePlanList,
  previewList: state.betting.previewList,
  suspend: state.chase.suspend,
}), {
  setTitle,
  chase,
  resetChase,
})
class Confirm extends Component {
  componentDidMount() {
    this.props.setTitle('高级追号确认')
  }

  getTableConfig () {
    return {
      height: '4rem',
      className: 'chase-confirm-table',
      columns: [{
        title: '序号',
        format: (value, data, index) => {
          return index + 1
        }
      }, {
        title: '期号',
        name: 'ticketPlanId'
      }, {
        title: '倍数',
        name: 'multiple'
      }, {
        title: '当期投入',
        name: 'betMoney',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }, {
        title: '累计投入',
        name: 'statisticsMoney',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }, {
        title: '当期奖金',
        name: 'basicMaxBonus',
        format: value => {
          return value ? _(value).convert2yuan() + '元' : '--'
        }
      }, {
        title: '预期盈利',
        name: 'expectBonus',
        format: value => {
          return value ? _(value).convert2yuan() + '元' : '--'
        }
      }, {
        title: '利润率',
        name: 'bonusRate',
        format: value => {
          return value ? (_(value || 0).formatMul(100).toFixed(1) + '%') : '--'
        }
      }]
    }
  }

  chase () {
    let { previewList, chasePlanList, suspend } = this.props

    this.props.chase({
      previewList: previewList,
      chasePlanList: chasePlanList,
      suspend: suspend,
    }, (done, resp) => {
      Alert({
        noCancel: true,
        title: done ? '恭喜': '错误',
        type: 'confirm',
        content: done ? `${actionType}成功` : (resp.msg || `${actionType}失败`),
        callback : () => {
          if (done) {
            this.props.resetChase()
            window.history.back()
          }
        }
      })
    })
  }

  render () {
    let { chasePlanList = [], previewList } = this.props
    let last = _(chasePlanList).last() || {}

    return <div className="chase-confrim-page">
      <Header />
      <div className="chase-page__card chase-page__card--margin-top" >
        <Table data={chasePlanList} config={this.getTableConfig()} />
      </div>
      <div className="chase-bar">
        <div className="chase-summary-text">总金额: {previewList.length}注 x {chasePlanList.length}期 = {_(last.statisticsMoney).convert2yuan()}元</div>
        <div className="chase-button" onClick={::this.chase}><img src="images/icon/hammer.png" /> 投注</div>
      </div>
    </div>
  }
}

module.exports = Confirm