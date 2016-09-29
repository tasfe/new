import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './DivisionManage.css'

import Table from 'components/Table'
import Tile from 'components/Tile'
import Loader from 'components/Loader'
import * as dmActions from 'redux/modules/Agency/divisionManage'
import Statistic from './modules/Statistic/Statistic'
import DividendConfig from 'modules/Agency/modules/DivisionManage/dividendConfig'

@connect(
  state => ({title: state.toolbar.title,
    divisionManageData: state.divisionManage.divisionManageData,
    user: state.auth.user
  }),
  {...actions, ...dmActions}
)

@withStyles(styles)


class DivisionManage extends Page {
  constructor () {
    super();

    this.tabConfig = {
      fields: [
        {
          title: '上半月',
          content: <Loader />
        },
        {
          title: '下半月',
          content: <Loader />
        }
      ]
    };

    this.state = {
      divisionManageData: {}
    };

  }

  componentWillReceiveProps(nextProps) {
    this.setState({divisionManageData: nextProps.divisionManageData});
  }

  componentDidMount () {
    this.props.setTitle('分红管理');
    let userRoot = this.props.user && this.props.user.root?this.props.user.root:undefined;
    let isGeneralAgency = false;
    if(userRoot){
      isGeneralAgency = userRoot.dividendStatus !== DividendConfig.getByName('UN_APPLIED').id;
    }
    if(isGeneralAgency) {
      this.props.loadStaticsData();
    }

    this.loaded();
  }

  shouldComponentUpdate (nextProps, nextState) {
    if(this.props.user !== nextProps.user) {
      return false;
    }
    if(!_.isEmpty(this.props.divisionManageData) && (this.props.divisionManageData !== nextProps.divisionManageData)) {
      return false;
    }
    return true;
  }

  renderTab (data) {
    var self = this;
    if (data && data.dividList && data.dividList.length) {
      this.tabConfig.fields = [];

      _.each(data.dividList, (dividData) => {
        let statisticConfig = {dividId: dividData.dividId, dividData: dividData};

        let content = {
          title: dividData.cycle,
          content: <Statistic config={statisticConfig} />
        };
        self.tabConfig.fields.push(content);
      });
    }
  }

  getTabData () {
    this.renderTab(this.state.divisionManageData);
  }

  render () {
    this.getTabData();
    console.log(this.tabConfig);
    return (
      <div className="division-manage">
        <Tab config={this.tabConfig} key={window.keyGenerator()} />
      </div>
    )
  }
}

module.exports = DivisionManage