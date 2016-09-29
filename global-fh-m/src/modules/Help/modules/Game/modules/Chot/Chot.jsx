import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Chot.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Chot extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--游戏类')
  }

  render () {
    return (
      <div className="padding-h-sm help-tic">
        <h3 className="help-tt">什么是冷热号？</h3>
        <p>彩票行业习惯将一段时间频繁出现的号码称为“热号”，而一段时间出现频率很低的号码称为“冷号”，冷热号只是一段时期的特征，长期看各号码出现的频率还是非常平均的。</p>
      </div>
    )
  }
}

module.exports = Chot