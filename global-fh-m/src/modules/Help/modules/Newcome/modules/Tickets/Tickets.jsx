import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Tickets.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Tickets extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute'}}>
        <h3 className="help-tt">目前有哪些彩种可以投注？</h3>
        <div className="hlep-pp">
          <p>
            （1） 时时彩类型： 重庆时时彩、江西时时彩（停售）、新疆时时彩、天津时时彩、黑龙江时时彩、分分彩、五分彩。
            <a className="" href="#/help/Play/ssc">[详情]</a>
          </p>
          <p>
            （2） 11选5类型：山东11选5、江西11选5、广东11选5。
            <a className="" href="#/help/Play/elcf">[详情]</a>
          </p>
          <p>
            （3） 低频彩：3D ，P3/P5。
            <a className="" href="#/help/Play/dpc">[详情]</a>
          </p>

        </div>
      </div>
    )
  }
}

module.exports = Tickets