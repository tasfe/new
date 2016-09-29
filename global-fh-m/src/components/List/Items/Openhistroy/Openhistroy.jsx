import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'

class Openhistroy extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data

    return (
      <div>
        <div className="iForm-list-inner" >
          <span className="openh-winnum">第{data.ticketPlanId}期 </span>
          <ul className="">
            {data.ticketOpenNum.split(',').map(item => {
              return <li key={window.keyGenerator()} className="number">{item}</li>
            })}
          </ul>
        </div>
      </div>
      
    )
  }
}

export  default Openhistroy