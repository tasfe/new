import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import List from 'components/List'
import ListItem from 'components/List/Items/ChaseRecord/ChaseRecordItem'
import WithStyles from 'with-style'
import styles from './ChaseRecord.css'


@WithStyles(styles)
class Bethistroy extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render () {
    let data = this.props.data
    let props = {
      data: data.detailList,
      item: ListItem,
      claxx: 'bet-item-detail-list',
      itemClass: 'bet-item-detail-list-item',
      childrenField: 'list'
    };
    console.log(props);

     return (
      <div className="bet-item " >
        <div className="bet-item-date">
          {data.date.substring(5)}
        </div>
        <div className="bet-item-detail">
          <List {...props} />
        </div>

      </div>
      
    )
  }
}

export  default Bethistroy