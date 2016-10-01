import React, { Component } from 'react'
import WithStyles from 'with-style'
import styles from './Lottery.css'

@WithStyles(styles)
class Lottery extends Component {
  render () {
    let {data, hasChildren} = this.props

    return (
      <div>
        {hasChildren ? ( '' ) : (
          <a href={`#/lottery/${data.id}`}>
            {data.badge == 'hot'? <div className="item-badge badge-hot">火 爆</div> : ''}
            {data.badge == 'recommend'? <div className="item-badge badge-sunshine">推 荐</div> : ''}
            <div className="border-radius-sm Lottery-img">
              <img src={data.img } alt="我是图片"/>
            </div>
            <div className="right">
              <p className="title">{data.zhName}</p>
              <div className="info">{data.desc}   {data.planCount}</div>
              <div className="info">{data.typeId === 'mmc' ? ('即投即开，无需等待') : ('分分投注，中奖不停！')}</div>
            </div>
          </a>
        )}
      </div>
    )
  }
}

export default Lottery