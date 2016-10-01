import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class Newcome extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <a className="iForm-list-inner arrow"  href={data.link}>{data.name}</a>
    )
  }
}

export  default Newcome