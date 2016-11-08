/**
 * 投注页
 */

import React, { Component, PropTypes, } from 'react'
import Selector from './../Selector'
import Header from './../Header'
import Body from './../Body'
import Footer from './../Footer'

const PULL_THRESHOLD = 100

class Main extends Component {
  static defaultProps = {
    onSwipe: () => {}
  }

  constructor () {
    super()

    this.startPointY = 0
    this.offset = 0
    this.incrase = 0
  }

  componentDidMount() {
    this.$touchTarget = $(this.refs.touchTarget)
    this.listenTouch()
  }

  updatePosition (x) {
    this.$touchTarget.css('transform', `translateY(${x}px)`)
  }

  listenTouch () {
    this.$touchTarget.on('touchstart', e => {
      let $target = $(e.target)
      if ($target.closest('.play-group-list').get(0) || !$target.closest('.top-area').get(0)) {
        return
      }
      this.startPointY = e.originalEvent.touches[0].clientY
      this.$touchTarget.on('touchmove', ::this.touchMove)
      this.$touchTarget.on('touchend', ::this.touchEnd)
    })
  }

  touchMove (e) {
    this.incrase = e.originalEvent.touches[0].clientY - this.startPointY
    this.updatePosition(this.incrase)
  }

  touchEnd () {
    this.offset += this.incrase
    if (0 > this.offset || PULL_THRESHOLD > this.incrase) {
      this.updatePosition(0)
      this.offset = 0
      this.incrase = 0
    } else {
      this.showHistory()
    }

    this.$touchTarget.off('touchend')
    this.$touchTarget.off('touchmove')
  }

  showHistory () {
    this.offset = innerHeight * .5
    this.incrase = 0
    this.updatePosition(this.offset)
    this.props.onSwipe(!!this.offset)
  }

  random () {
    
  }

  render () {
    let id = this.props.id

    return <div ref="touchTarget" className="bet-main" style={{height: '100%'}}>
      <div className="top-area">
        <Selector id={id} showHistory={::this.showHistory} />
        <Header id={id} />
      </div>
      <Body />
      <Footer id={id} />
    </div>
  }
}

export default Main