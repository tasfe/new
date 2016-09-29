import React, { Component, PropTypes } from 'react'
import ListItem from './ListItem'

class SubList extends Component {
  static propTypes = {
    data: PropTypes.any,
    item: PropTypes.func.isRequired
  }

  render () {
    let {data, item, level, ...other} = this.props

    return (
      <ul className={cx({
        'sub-list': true,
        [`level-${level}`]: true
      })}>
        {data.map((menu, index) => {
          return <ListItem key={window.keyGenerator()} data={menu} item={item} level={level} index={index} {...other}></ListItem>
        })}
      </ul>
    )
  }
}

export  default SubList
