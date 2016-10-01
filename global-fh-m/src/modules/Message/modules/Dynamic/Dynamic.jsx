import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Dynamic.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import List from 'components/List'
import ListItem from 'components/List/Items/Dynamic'
import Pagination from 'components/Pagination'
import { setMiddleButton } from 'redux/modules/toolbar'
import { setTitle } from 'redux/modules/toolbar'
import TouchLoader from 'components/TouchLoader';

@connect(
  state => ({title: state.toolbar.title}),
  {...actions, setTitle, setMiddleButton}
)

@WithStyles(styles)

class Dynamic extends Page {
  
  constructor() {
    super()

    this.state = {
      canRefreshResolve: true,//是否允许刷新
      initializing: 1,//进度条:1是加载中，2是加载完成
      hasMore: 0,//是否展示加载更多
      data: []
    }
    this.pageSize = 10
    this.pageIndex = 0

    this.buList = [];
  }

  componentDidMount () {
    this.props.setTitle('平台公告');
    //this.props.setMiddleButton(<div className="toolbar-middleBtn-group"><a className="toolbar-middleBtn active" href="/#/message/dynamic">公告</a><a className="toolbar-middleBtn" href="/#/user/il">站内信</a></div>)
    this.getDynamic();
  }
  getDynamic(resolve, reject){
    var self = this;
    ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data: {
        pageSize:this.pageSize,
        pageIndex:this.pageIndex
      }
    }, resp => {
      self.buList = self.buList.concat(resp.root.buList);
      self.setState({
        data: self.buList,
        initializing: 2,
        hasMore: resp.root.rowCount>(self.pageSize*(self.pageIndex+1)) ? 1:0,
        rowCount: resp.root.rowCount
      });
      if(resolve){
        resolve();
      }
    }, err => {
      if(reject){
        reject();
      }
      window.Alert({
        title: '系统提示',
        content: err.msg || '数据加载失败！'
      });
    })
  }

  refresh(resolve, reject) {
    if (!this.state.canRefreshResolve) return reject();
    this.pageIndex = 0;
    this.buList = [];
    this.getDynamic( resolve, reject);
  }

  loadMore(resolve) {
    if(this.state.hasMore===1){
      this.pageIndex = this.pageIndex + 1;
      this.getDynamic(resolve);
    }
  }

  render () {
    var { hasMore, initializing } = this.state;

    return <div className="dynamic-list">
      {this.props.children  || (
      <TouchLoader className="" onRefresh={::this.refresh} onLoadMore={::this.loadMore} hasMore={hasMore}
        initializing={initializing}>
        <List data={this.state.data} item={ListItem} claxx="iForm-list" itemClass="act-li" />
      </TouchLoader>
     )}
    </div>
  }
}

module.exports = Dynamic