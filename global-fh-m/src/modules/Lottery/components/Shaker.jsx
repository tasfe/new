/**
 * 摇一摇
 */

import React, { Component, PropTypes } from 'react'
import Shake from 'shake.js'
import { connect } from 'react-redux'

@connect(state => ({
  playMode: state.lottery.playMode,
}))
class Shaker extends Component {
  shakeEventDidOccur () {
    let result = this.props.playMode.create()
    console.log('shake result', result)
  }

  componentDidMount() {
    this.shakeEvent = new Shake({
      threshold: 15,
      timeout: 1000,
    })
    this.shakeEvent.start()
    window.addEventListener('shake', this.shakeEventDidOccur, false)
  }

  componentWillUnmount() {
    this.shakeEvent.stop()
    window.removeEventListener('shake', this.shakeEventDidOccur, false)
  }

  render () {
    return <div className="shaker" onClick={::this.shakeEventDidOccur}>
      <img src={require("/images/icon/fh-shake.png")} alt="摇一摇"/> 摇一摇
    </div>
  }
}

export default Shaker
