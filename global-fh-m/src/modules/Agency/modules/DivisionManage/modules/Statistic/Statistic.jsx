import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Statistic.css'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'
import Tile from 'components/Tile'
import Loader from 'components/Loader'

@connect(
  state => ({}),
  {...actions, pushState: routerActions.push, filter}
)

@withStyles(styles)

class Statistic extends Page {
  constructor (props) {
    super(props);

    this.postData = {
      dividId: props.config.dividId
    };

    this.tileConfig = {};

    this.style = {
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

    //this.tableConfig = {
    //  className: 'seriesList-table',
    //  columns: [{
    //    title: '日期',
    //    name: 'cycle'
    //  }, {
    //    title: '结算',
    //    name: 'profitTotal',
    //    format: (value, data) => {
    //      return _.fixedConvert2yuan(value);
    //    }
    //  }, {
    //    title: '分红比',
    //    name: 'divid',
    //    format: (value, data) => {
    //      return _.div(value, 100);
    //    }
    //  }, {
    //    title: '预计分红',
    //    name: 'dividTotal',
    //    format: (value, data) => {
    //      return _.convert2yuan(value);
    //    }
    //  }],
    //  transport: {
    //    parse: data => {
    //      return data && data.dividList || []
    //    },
    //    read: () => {
    //      return {
    //        url: '/fund/divid/subdividdetail.json',
    //        data: this.postData
    //      }
    //    }
    //  }
    //};

  }

  componentDidMount () {
    this.props.setTitle('分红管理');
  }

  renderContent () {
    let dividData = this.props.config.dividData;
    let status = this.props.config.dividData.status;
    switch (status) {
      case 0:
        status ='申请领取';
        break;
      case 1:
        status ='已发放';
        break;
      case 2:
        status ='不发放';
        break;
      case 3:
        status ='申请发放中';
        break;
      case 9:
        status ='统计中';
        break;
      default:
        status ='';
    };

    this.tileConfig = {
      tile1:{
        title: '团队总投注额',
        content: isNaN(dividData.betTotal) ? <Loader /> : _.convert2yuan(dividData.betTotal) + '元'
      },
      tile2:{
        title: '团队总盈亏',
        content: isNaN(dividData.profitTotal) ? <Loader /> :  _.convert2yuan(dividData.profitTotal) + '元'
      },
      tile3:{
        title: '您分红比例',
        content: isNaN(dividData.divid) ? <Loader /> :  _(dividData.divid).div(100) + '%'
      },
      tile4:{
        title: '追加分红比例',
        content: isNaN(dividData.addDivid) ? <Loader /> :  _(dividData.addDivid).div(100) + '%'
      },
      tile5:{
        title: '分红金额('+ status+ ')',
        content: isNaN(dividData.dividTotal) ? <Loader /> :  _.convert2yuan(dividData.dividTotal) + '元'
      }
      //tile5:{
      //  title: '目前冻结的金额',
      //  content: isNaN(dividData.freezeTotal) ? <Loader /> : _.convert2yuan(dividData.freezeTotal) + '元'
      //}
    };

  }

  render () {
    this.renderContent();

    return (
      <div>
        <Tile config={this.tileConfig.tile1} tileStyle={this.style.tile1} />
        <Tile config={this.tileConfig.tile2} tileStyle={this.style.tile2} />
        <Tile config={this.tileConfig.tile3} tileStyle={this.style.tile3} />
        <Tile config={this.tileConfig.tile4} tileStyle={this.style.tile4} />
        <Tile config={this.tileConfig.tile5} tileStyle={this.style.tile5} />
        {
          //<div className="table-container">
          //  <Table config={ this.tableConfig }/>
          //</div>
        }

      </div>
    )
  }
}

module.exports = Statistic