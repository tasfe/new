import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import WithStyles from 'with-style'
import styles from './Dynamic.css'

@WithStyles(styles)

class Dynamic extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <div>
        <a className="iForm-list-inner arrow"  href={ "#/message/dynamic/dynamicdetail/" + data.bulletionId }>
          <p className="act-text-lv12">{data.title}</p><br/>
          <p className="act-text-lv10 text-gray">{new Date(data.time).toString('yyyy-MM-dd HH:mm:ss')}</p>
        </a>
      </div>
      
    )
  }
}

export  default Dynamic