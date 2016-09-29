import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Chase.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Chase extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">什么是追号？</h3>
        <p>指选定某些固定选号，在一定期数内进行连续投注的过程。以往在进行守号投注，需要每天都投注一次，非常麻烦。如果某天因故未能购买，而错失中奖机会，将会令人抱憾不已。使用“追号”功能，只需一次操作即可自动完成多期投注，省时省力。还可自由选择“中奖后停止追号”大大的方便了平台用户投注。</p>
      </div>
    )
  }
}

module.exports = Chase