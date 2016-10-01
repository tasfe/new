/**
 * 投注页 右上角菜单
 */

import React, { Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Menu.css'
import { connect } from 'react-redux'
import { set as setBetting } from 'redux/modules/Lottery/betting'

@WithStyles(styles)
@connect(state => ({
  playInfo: state.lottery.playInfo,
  unit: state.betting.unit,
}), {
  setBetting,
})
class Menu extends Component {
  toggle () {
    this.$menu.toggle('fast', () => {
      this.$menu.css('width', this.menuWidth).find('li').show().find('.content').hide()
    })
  }

  showContent (e) {
    e.stopPropagation()

    let $target = $(e.currentTarget)

    this.$menu.animate({
      width: innerWidth
    }, 'fast', () => {
      $target.siblings().hide('fast').end().find('.content').show('fast')
    })

    return false
  }

  onUnitChange (e) {
    let $target = $(e.target)
    if ($target.is('.mode')) {
      $target.addClass('active').siblings().removeClass('active')
      this.props.setBetting({
        unit: Number(e.target.dataset.value)
      })
    }
  }

  componentDidMount () {
    this.$menu = $(this.refs.menu)
    this.menuWidth = getComputedStyle(this.$menu.get(0)).width
    this.$menu.find(`.mode[data-value="${this.props.unit}"]`).addClass('active')
  }

  render () {
    console.log('render menu')
    let playInfo = this.props.playInfo || {}
    return <div className="menu-holder" onClick={this.toggle.bind(this)}><img src="images/icon/fh-betting-menu.png" alt="投注菜单"/>
      <div ref="menu" className="menu">
        <div className="menu-overlay"></div>
        <ul>
          <li className="menu-item" onClick={this.props.showHistory}>
            <img className="icon" src="images/icon/fh-betting-menu-trend.png" alt="近期走势"/>
            近期走势
          </li>
          <li className="menu-item" onClick={::this.showContent}>
            <img className="icon" src="images/icon/fh-betting-menu-guide.png" alt="玩法说明"/>玩法说明
            <div className="content" style={{display: 'none'}}>{playInfo.playDes}</div>
          </li>
          <li className="menu-item">
            <span className="switcher" onClick={::this.onUnitChange}>
              <span className="mode" data-value="10000">元</span>
              <span className="mode" data-value="1000">角</span>
              <span className="mode" data-value="100">分</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  }
}

export default Menu