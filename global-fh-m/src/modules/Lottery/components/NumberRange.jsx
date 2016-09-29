/**
 * 投注页 倍投 选数器
 */

import React, { Component } from 'react'
import { set } from 'redux/modules/Lottery/betting'
import { connect } from 'react-redux'
import Range from 'components/NumberRange'

@connect(state => ({
  formatMaxMultiple: state.betting.formatMaxMultiple
}), {
  set
})
class NumberRange extends Component {
  constructor (props) {
    super(props)

    this.state = {
      max: props.formatMaxMultiple || 1,
    }
  }

  componentDidMount () {
    // set Default
    this.sync(1)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      max: nextProps.formatMaxMultiple
    })
  }

  render () {
    return <div>倍投 <Range defaultValue={1} min={1} max={this.state.max} onChange={::this.sync}/></div>
  }

  sync (value) {
    this.props.set({
      multiple: value
    })
  }

}

export default NumberRange