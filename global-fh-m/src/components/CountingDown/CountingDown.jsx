import React, { Component } from 'react'

class CountingDown extends Component {

  constructor (props) {
    super(props)

    // DHMS 日时分秒
    this.order = 'DHMS'

    this.setting = {
      S: {
        rate: 1,
        endon: 60
      },
      M: {
        rate: 60,
        endon: 60
      },
      H: {
        rate: 3600,
        endon: 24
      },
      D: {
        rate: 86400,
        endon: 365
      }
    }

    this.left = window.Number(props.left || props.time || 0)
    this.time = window.Number(props.time || props.left || 0)

    this.interval = null
    this.state = {}
  }

  getDateObj () {
    let o = {}
    for (let key in this.setting) {
      let { rate, endon } = this.setting[key]
      o[key] = this.left === rate ? 1 : (this.left > rate ? Math.floor((this.left % (rate * endon)) / rate): 0)
    }
    return o
  }

  setup () {
    this.left && (this.interval = window.setInterval(() => {
      if (--this.left <= 0) {
        if (this.props.loop) {
          this.left = this.time
        } else {
          this.stop()
        }
        let cb = this.props.callback
        cb && cb()
      }
      this.setState(this.getDateObj())
    }, 1000))
  }

  stop () {
    this.pause()
    this.left = 0
  }

  pause () {
    window.clearInterval(this.interval)
  }

  continue () {
    this.setup()
  }

  reset (time) {
    this.left = time
    this.setup()
  }

  componentDidMount () {
    this.setup()
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps || (nextProps && nextProps.refreshId !== this.props.refreshId)) {
      this.stop()
      this.left = nextProps.left
      this.time = nextProps.time
      this.setup()
    }
  }

  componentWillUnmount () {
    console.log('ummount counting down')
    this.stop()
  }

  render () {
    console.log('counting...')
    let format = this.props.format

    return <span className="bet-counting-down">{format.replace(new RegExp(`[${this.order}]`, 'g'), match => {
      return ('0' + (this.state[match] || '0')).substr(-2)
    })}</span>
  }
}

export default CountingDown