import React, { Component, PropTypes } from 'react'

class MenuItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <a className="mmenu-submenu-link" href={data.href || 'javascript:void 0'}>
        {data.icon && <i className={data.icon}></i>}
        {data.text}
      </a>
    )
  }
}

export  default MenuItem
