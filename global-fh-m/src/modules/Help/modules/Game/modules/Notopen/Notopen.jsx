import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Notopen.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Notopen extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">官方未开奖如何处理？</h3>
        <p>繁华世界在线娱乐针对时时彩、11选5类游戏，超过2小时未获得开奖号码， 则对超过的期数进行系统撤单返款，依次顺延下去。 撤单之后，如果官方开奖，平台仍维持撤单处理。游戏撤单无手续费。</p>
      </div>
    )
  }
}

module.exports = Notopen