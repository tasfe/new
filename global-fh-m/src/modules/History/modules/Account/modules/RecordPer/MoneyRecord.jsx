import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import moneyStyles from './MoneyRecord.css'
import List from 'components/List'
import ListItem from 'components/List/Items/MoneyRecord'
import ticketConfig from 'misc/ticketImgConfig'

import TouchLoader from 'components/TouchLoader';

@connect(state => ({}), {...actions})

@withStyles(moneyStyles)
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
    this.balanceList = [];

  }

  componentWillReceiveProps(nextProps) {
   // console.log(this.state,' abc');

  }

  componentDidMount() {
    this.loadData();
  }

  refresh(resolve, reject) {
    //debugger
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
    var data = {pageSize: this.pageSize, pageIndex: this.pageIndex,};
    if(this.props.config){
      data = _(data).extend(this.props.config);
    }
    ajax({url: '/fund/balance/historyformobile.json', data: data}, function (res) {
      if (res && res.result === 0) {
        console.log(res.root.betList);

        if(res.root && res.root.total){
          $('.js-md-total-balance').html(res.root.total.balanceTotal!=undefined?_(res.root.total.balanceTotal).convert2yuan():'-');
          $('.js-md-total-bonus').html(res.root.total.bonusTotal!=undefined?_(res.root.total.bonusTotal).convert2yuan():'-');
          $('.js-md-total-bet').html(res.root.total.betTotal!=undefined?_(res.root.total.betTotal).convert2yuan():'-');
          $('.js-md-total-prize').html(res.root.total.prizeTotal!=undefined?_(res.root.total.prizeTotal).convert2yuan():'-');
        }

        self.balanceList = self.balanceList.concat(res.root.balanceList);
        var ldata = _(self.balanceList).each(function(item){
          item.date = new Date(item.createTime).toString('YYYY-MM-DD HH:mm');
        });
        //console.log(ldata)
        self.setState({
          balanceList: ldata,
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


    let ldata = this.state.balanceList || [];

    let props = {
      data: ldata,
      item: ListItem,
      claxx: 'MoneyDetail-list',
      itemClass: 'MoneyDetail-item',
      childrenField: 'list'
    };

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