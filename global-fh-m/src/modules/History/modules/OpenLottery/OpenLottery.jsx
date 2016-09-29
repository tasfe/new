import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import * as oActions from 'redux/modules/History/oplottery'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './OpenLottery.css'
import List from 'components/List'
import ListItem from 'components/List/Items/OpLottery'
import ticketConfig from 'misc/ticketImgConfig'

@connect(state => ({
  openData: state.oplottery.openData
}),{...actions, ...oActions})

@withStyles(styles)

class OpenLottery extends Page {

  constructor () {
    super();
    this.state = {
      openData: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({openData: nextProps.openData});
  }

  componentDidMount () {
    this.props.loadData();
    this.props.setTitle('开奖号码');
  }

  render () {
    let ldata = this.state.openData || {};

    ldata =  _(ldata).chain().map((item, key) => {
      if(ticketConfig.get(item[0].ticketId)){
        /*return key != 15 && key != 17 && {
          ticketId: key,
          history: item
        }*/
        return {
          ticketId: key,
          history: item
        }
      }else{
        return ;
      }
    }).filter(_.identify).value()

    let props = {
      data: ldata,
      item: ListItem,
      claxx: 'lottery-list',
      itemClass: 'lottery-item',
      childrenField: 'list'
    };

    return (
      <div>
        {this.props.children ||  <div className="ol-openLottery">
        <List {...props} />
          </div>}
      </div>
    )
  }

}

module.exports = OpenLottery