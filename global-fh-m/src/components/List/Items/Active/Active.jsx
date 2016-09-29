import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class Active extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <div className="act-form-lo" className={cx({
          'act-form-lo': true,
          'act-overdue': data.bannerStatus == 0 ? false : true
        })} >
        <a className="iForm-list-inner">
          <p className="act-text-lv12">{data.activityTitle}</p><br/>
          <p className="act-text-lv10">活动时间：{new Date(data.startTime).toString('yyyy-MM-dd')}至{new Date(data.endTime).toString('yyyy-MM-dd')}</p>
        </a>
        {data.bannerStatus == 0 ? <span className="ad-badge">进行中</span> : <span className="ad-badge-over">已结束</span> }
      </div>
    )
  }
}

export  default Active