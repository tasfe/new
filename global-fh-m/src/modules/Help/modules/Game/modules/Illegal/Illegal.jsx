import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Illegal.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Illegal extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">什么是恶意投注？</h3>
        <p>用户使用不当程序在平台下载或者已经获知官方开奖结果等类似的情况下，在平台下注的行为视为“恶意投注”基于公平原则，平台将予以冻结处理。（“恶意投注”的最终解释权归繁华在线娱乐所有）</p>
      </div>
    )
  }
}

module.exports = Illegal