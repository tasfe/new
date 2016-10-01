import React, { Component, PropTypes } from 'react'
import SubList  from './SubList'

class ListItem extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    item: PropTypes.func.isRequired,
    index: PropTypes.number
  }

  render () {
    let { data, item, level, index, ...other} = this.props
    let ItemComponent = item
    let childrenField = other.childrenField || 'children'
    let hasChildren = data[childrenField] && !!data[childrenField].length

    return (
      <li className={'list-item' + (level ? ' sub-list-item' : '') + (' ' + (other.itemClass || ''))}>
        <ItemComponent data={data} level={level} hasChildren={hasChildren} index={index} />
        {hasChildren && <SubList data={data[childrenField]} item={item} level={level ? (level + 1) : 2} {...other} />}
      </li>
    )
  }
}

export  default ListItem