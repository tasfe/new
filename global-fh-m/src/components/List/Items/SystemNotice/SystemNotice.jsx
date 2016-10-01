import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class SystemNotice extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data
    return (
      <div className="sysno-fl">
        <p>
        {2 === data.type ? 
          (<span>{data.title}<Link className="iForm-list-inner"  to="/user/ol"> 操作日志</Link></span>) : 
            (0 === data.type ? 
            (data.title) : 
            <Link className="iForm-list-inner"  to={"message/sysnotice/noticedetail/" +data.noticeId }>{data.title}</Link>)}
        </p>
        <br/>
        <p className="text-align-rt">{new Date(data.time).toString('yyyy-MM-dd HH:mm:ss')}</p>
      </div>
    )
  }
}

export  default SystemNotice