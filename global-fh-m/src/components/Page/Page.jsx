import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
class Page extends Component {

  loading () {
    $.loading.apply($, arguments)
  }

  loaded () {
    $.loaded()
  }

  verify (conditions) {
    if (conditions && conditions.length) {
      window.location = `#/confirm?from=${window.encodeURIComponent(this.props.location.pathname)}&conditions=${conditions.join(',')}&a=b`
    }
  }

  remToPx (r) {
    return r * (100 * innerWidth / 320)
  }

}

export default Page
