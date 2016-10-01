import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import WithStyles from 'with-style'
import styles from './Bonus.css'

@WithStyles(styles)

class Bonus extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let {data} = this.props;

    return (
      <div style={{position:'relative'}} className={data.itemClass}>
        <div className="bonus-badge">
          <div className="bonus-num"><div>返点</div><div style={{fontSize:"0.14rem", lineHeight:"0.16rem"}}>{data.userRebate}%</div></div>
        </div>
        <p className="bonus-title"><span>玩法： {data.ticketLevelName} - {data.ticketPlayName}</span></p>
        <p className="bonus-info"><span className="bonus-info-title">最低奖金: </span><span className="bonus-info-min">{data.ticketPlayBonus}</span></p>
        <p className="bonus-info"><span className="bonus-info-title">最高奖金: </span><span className="bonus-info-max">{data.ticketPlayMaxBonus}</span></p>
      </div>
    )
  }
}

export  default Bonus