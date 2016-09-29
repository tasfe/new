import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Chaseinfo.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Chaseinfo extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">平台各个追号玩法含义</h3>
        <p>同倍追号：同倍追号指设定追号期数和倍数之后，所有的期数的投注倍数都与设置倍数相同。</p>
        <p>翻倍追号：翻倍追号需要设置隔*期翻*倍，点击立即生成，系统将立即生成为与设置一致的投注，点击投注即可成功。</p>
        <p>盈利率追号：指追号计划中保证中奖的最低利润，例如，后三直选投012共一注1倍，我们设定如果中奖最低盈利不低于100%。选择起始倍  数为1倍，共追号25期，点击生成之后，系统会为您计算投注倍数。您的总投注金额是50元。如果您追号中奖之后，您的盈利将不低于已投注总金额100%。</p>
      </div>
    )
  }
}

module.exports = Chaseinfo