import React, { Component, PropTypes } from 'react'
import ListItem from './ListItem'

class List extends Component {
  static propTypes = {
    data: PropTypes.array,
    item: PropTypes.func.isRequired
  }

  render () {
    let {data, ...other} = this.props

    return (
      <ul id={other.id || ''} className={'list ' + (other.claxx || '')}>
        {data && !!data.length && data.map((menu, index) => {
          return <ListItem key={window.keyGenerator()} data={menu} {...other} index={index}></ListItem>
        })}
        {!data && <li style={{textAlign: 'center'}}><i className="fa fa-circle-o-notch fa-spin"></i></li>}
        {data && !data.length && <li style={{textAlign: 'center'}}>暂无数据</li>}
      </ul>
    )
  }
}

export  default List