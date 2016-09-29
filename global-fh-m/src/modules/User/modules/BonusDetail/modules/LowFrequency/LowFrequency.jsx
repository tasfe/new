import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import * as bActions from 'redux/modules/User/bonus'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import List from 'components/List'
import ListItem from 'components/List/Items/Bonus'
import Loader from 'components/Loader'
import styles from './LowFrequency.css'

@connect(state => ({
  title: state.toolbar.title,
  bonusData: state.bonus.bonusData,
  user: state.auth.user
}),{...actions, ...bActions})
@withStyles(styles)

class LowFrequency extends Page {
  constructor () {
    super();
    //this.BonusData = [{
    //  ticketPlayName: "直选复式",
    //  ticketPlayBonus: 1700000000,
    //  ticketPlayMaxBonus: 1700000000
    //}];

    this.state = {
      bonusData: {}
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({bonusData: nextProps.bonusData});
  }

  componentDidMount () {
    let postData = {
      ticketSeriesId: 3,
      subAcctId: this.props.user.root.userId
    };
    this.props.loadStaticsData(postData);
    this.props.setTitle('奖金详情');
  }

  render () {
    this.BonusData = this.state.bonusData.playBonusList? this.state.bonusData.playBonusList.levels : [];

    if (this.BonusData.length) {
      var newBonusData = [];
      var newData;
      var levels = this.BonusData || [];
      if (levels.length) {
        for (var i=0; i < levels.length; i++) {
          var groups = levels[i].groups || [];
          if(groups && groups.length) {
            for (var j=0; j < groups.length; j++) {
              var plays = groups[j].plays;
              if (plays && plays.length) {
                for (var k=0; k < plays.length; k++) {
                  newData = {};
                  newData.ticketLevelName = levels[i].ticketLevelName || '';
                  newData.ticketPlayName = plays[k].ticketPlayName;
                  newData.ticketPlayBonus = _.convert2yuan(plays[k].ticketPlayBonus);
                  newData.ticketPlayMaxBonus = _.convert2yuan(plays[k].ticketPlayMaxBonus);
                  newData.userRebate = _.div(plays[k].userRebate, 10);
                  newBonusData.push(newData);
                }
              }
            }
          }
        }
      }
      this.BonusData = newBonusData;
    }

    let props = {
      data: this.BonusData,
      item: ListItem,
      claxx: 'bonus-list',
      itemClass: 'bonus-item',
      childrenField: 'list'
    };


    return (
      <div className="bd-bonusDetail">
        <List {...props} />
      </div>
    )
  }
}

module.exports = LowFrequency