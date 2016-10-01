import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import * as tdActions from 'redux/modules/Agency/teamDynamic'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './TeamDynamic.css'
import Table from 'components/Table'
import Tile from 'components/Tile'
import Loader from 'components/Loader'
import NewSubLevel from './modules/NewSubLevel/NewSubLevel'
import UnactiveSubLevel from './modules/UnactiveSubLevel/UnactiveSubLevel'
import TRecharge from './modules/TRecharge/TRecharge'
import TBetting from './modules/TBetting/TBetting'

@connect(state => ({
  title: state.toolbar.title,
  teamDynamicData: state.teamDynamic.teamDynamicData
}),{...actions, ...tdActions})

@withStyles(styles)

class TeamDynamic extends Page {

  constructor () {
    super();

    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    this.tabConfig = {
      fields: [
        {
          title: '新增下级',
          content: <NewSubLevel />
        },
        {
          title: '不活跃下级',
          content: <UnactiveSubLevel />
        },
        {
          title: '团队充值',
          content: <TRecharge />
        },
        {
          title: '团队销量',
          content: <TBetting />
        }
      ]
    };

    this.state = {
      teamDynamicData: {}
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({teamDynamicData: nextProps.teamDynamicData});
  }

  componentDidMount () {
    let postData = {
      startTime: this.formatDate,
      endTime: this.formatDate
    };

    this.props.loadStaticsData(postData);

    this.props.setTitle('团队动态');
  }

  render () {
    const style = {
      tile1: {
        background: 'rgb(201, 73, 73)',
        borderRadius: '0.1rem'
      },
      tile2: {
        background: 'rgb(135, 182, 112)',
        borderRadius: '0.1rem'
      },
      tile3: {
        background: 'rgb(233, 189, 84)',
        borderRadius: '0.1rem'
      },
      tile4: {
        background: 'rgb(77, 169, 174)',
        borderRadius: '0.1rem'
      },
      tile5: {
        background: 'rgb(200, 109, 201)',
        width: '98%',
        borderRadius: '0.1rem'
      }
    };

    let tileConfig = {
      tile1:{
        title: '今日盈亏',
        content: isNaN(this.state.teamDynamicData.todayProfitTotal) ? <Loader /> : _.convert2yuan(this.state.teamDynamicData.todayProfitTotal)
      },
      tile2:{
        title: '团队余额',
        content: isNaN(this.state.teamDynamicData.balanceTotal) ? <Loader /> :  _.convert2yuan(this.state.teamDynamicData.balanceTotal)
      },
      tile3:{
        title: '今日充值',
        content: isNaN(this.state.teamDynamicData.todayRechargeTotal) ? <Loader /> :  _.convert2yuan(this.state.teamDynamicData.todayRechargeTotal)
      },
      tile4:{
        title: '今日销量',
        content: isNaN(this.state.teamDynamicData.todayBetTotal) ? <Loader /> :  _.convert2yuan(this.state.teamDynamicData.todayBetTotal)
      },
      tile5:{
        title: '今日在线',
        content: isNaN(this.state.teamDynamicData.todayOnlineTotal) ? <Loader /> : this.state.teamDynamicData.todayOnlineTotal
      }
    };

    return (
      <div className="td-teamDynamic">
        <Tile config={tileConfig.tile1} tileStyle={style.tile1} />
        <Tile config={tileConfig.tile2} tileStyle={style.tile2} />
        <Tile config={tileConfig.tile3} tileStyle={style.tile3} />
        <Tile config={tileConfig.tile4} tileStyle={style.tile4} />
        <Tile config={tileConfig.tile5} tileStyle={style.tile5} />
        <Tab config = {this.tabConfig} />
      </div>
    )
  }

}

module.exports = TeamDynamic