import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './BetRecord.css'
import List from 'components/List'
import ListItem from 'components/List/Items/BetRecord'
import ticketConfig from 'misc/ticketImgConfig'

import TouchLoader from 'components/TouchLoader';

@connect(state => ({}), {...actions})

@withStyles(styles)

class OpenLottery extends Page {

  constructor() {
    super();
    this.state = {
      canRefreshResolve: true,//是否允许刷新
      initializing: 1,//进度条:1是加载中，2是加载完成
      hasMore: 0,//是否展示加载更多
      betData: [],//列表数据
    };
    this.pageSize = 10;
    this.pageIndex = 0;//当前页码
    this.betList = [];

  }

  componentWillReceiveProps(nextProps) {
   // console.log(this.state,' abc');

  }

  componentDidMount() {
    this.props.setTitle('投注记录');
    this.loadData();
  }

  refresh(resolve, reject) {
    if (!this.state.canRefreshResolve) return reject();
    this.pageIndex = 0;
    this.betList = [];
    this.loadData( resolve, reject);
  }

  loadMore(resolve) {
    if(this.state.hasMore===1){
      this.pageIndex = this.pageIndex + 1;
      this.loadData(resolve);
    }
  }

  loadData( resolve, reject) {
    var self = this;
    var data = {pageSize: this.pageSize, pageIndex: this.pageIndex,betStatus: -1};
    if(this.props.config){
      data = _(data).extend(this.props.config);
    }
    ajax({url: '/ticket/bethistory/userbethistory.json', data: data}, function (res) {
      if (res && res.result === 0) {
        console.log(res.root.betList);
        self.betList = self.betList.concat(res.root.betList);
        var ldata = _(self.betList).chain().each(function(item){
          item.date = new Date(item.betTime).toString('YYYY年MM月DD');
          item.status = _({
            betStatus: item.ticketBetStatus,
            hasException: item.hasException,
            openNumbers: item.ticketResult,
            openStatus: item.ticketOpenStatus,
            prizing: item.prizing,
            prizeTotalMoney: item.prizeTotalMoney,
            betTime: item.betTime,
            ticketPlanId: item.ticketPlanId
          }).checkBettingStatus();
        }).groupBy(function(item){
          return item.date;
        }).map(function(item,index){
          return {
            date: index,
            detailList: item
          }
        }).value();

        console.log(ldata)

        self.setState({
          betData: ldata,
          initializing: 2,
          hasMore: res.root.rowCount>(self.pageSize*(self.pageIndex+1)) ? 1:0,
          rowCount: res.root.rowCount
        });

        if(resolve){
          resolve();
        }
      }
      self.loaded();
    }, function (res) {
      self.setState({
        checkError: res,
      });
      window.Alert({
        title: '系统提示',
        content: res.msg || '请求失败！',
      })
      if(reject){
        reject();
      }
      self.loaded();
    })
  }

  render() {

    var { hasMore, initializing } = this.state;
    var { refresh, loadMore } = this;
    var list = [];


    let ldata = this.state.betData || [];

    //ldata = _.filter(ldata, data => {
    //  if (ticketConfig.get(data.ticketId)) {
    //    return data.ticketId != 15 && data.ticketId != 17
    //  }
    //});

    let props = {
      data: ldata,
      item: ListItem,
      claxx: 'BetRecord-list',
      itemClass: 'BetRecord-item',
      childrenField: 'list'
    };
    //console.log(this.state);

    return (
      <div>
        {this.props.children ||
        <TouchLoader className="" onRefresh={::this.refresh} onLoadMore={::this.loadMore} hasMore={hasMore}
                     initializing={initializing}>
          <List {...props} />
        </TouchLoader>}
      </div>
    )
  }

}

module.exports = OpenLottery