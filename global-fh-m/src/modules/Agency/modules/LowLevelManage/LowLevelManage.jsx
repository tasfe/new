import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as lmActions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'
import withStyles from 'with-style'
import styles from './LowLevelManage.css'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'

@connect(
  state => ({title: state.toolbar.title, user: state.auth.user}),
  {...lmActions, pushState: routerActions.push, filter}
)

@withStyles(styles)

class LowLevelManage extends Page {
  constructor (props) {
    super(props);

    let self = this;
    var user = props.user;

    this.tableId = window.keyGenerator();
    //this.myDate = new Date();
    //this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    this.tableConfig = {
      pagable: true,
      columns: [{
        title: '用户名',
        name: 'userName',
        format: (value, data) => {
          return value
        }
      }, {
        title: '返点',
        name: 'rebate',
        format: (value, data) => {
          return _.div(value,10)
        }
      }, {
        title: '个人余额',
        name: 'balance',
        format: (value, data) => {
          return _.convert2yuan(value);
        }
      }, {
        title: '注册时间',
        name: 'regTime',
        format: (value, data) => {
          return new Date(value).toString('yyyy-MM-dd hh:mm:ss')
        }
      }, {
        title: '不活跃天数',
        name: 'uDays'
      }],
      command: [{
        text: '查看下级',
        visible: data => {
          if (data.userSubAcctNum) {
            return true;
          } else {
            return false;
          }
        },
        click: data => {
          window.history.pushState('', '', `#/agency/llm?userParentId=${data.userId}`)
          this.props.filter(this.tableId, {
            url: '/acct/subacctinfo/getsubacctlist.json',
            data: {
              userParentId: data.userId
            }
          });
          this.props.setTitle('下级管理 > ' + data.userName);
          return false
        }
      }, {
        text: '转账',
        className: '',
        click: (data) => {
          self.loading();
          ajax({url: '/fund/moneypd/checkpaypwd.json'}, res => {
            if (res && res.result === 0) {
              self.loaded();
              self.props.pushState('/agency/llm/transfer/' + data.userId+'?name='+data.userName);
            }
          }, err => {
            window.Alert({
              title: '',
              content: '当前用户未设置资金密码，无法进行转账操作' || err.msg
            });
          })
        }

      }, {
        className: '',
        text: '升点',
        visible: data => {
          if (user && user.root && user.root.merchant) {
            return false;
          } else {
            return true;
          }
        },
        link: (data) => {
          return `#/agency/llm/rebate/${data.userId}?name=${data.userName}&tabindex=1`
        }
      }, {
        text: '投注',
        link: (data) => {
          return `#/history/betting?name=${data.userName}&id=${data.userId}&tabindex=1`
        }
      }, {
        text: '追号',
        link: (data) => {
          return `#/history/trade?name=${data.userName}&id=${data.userId}&tabindex=1`
        }
      }, {
        text: '账变',
        link: (data) => {
          return `#/history/account?name=${data.userName}&id=${data.userId}&tabindex=1`
        }
      }],
      transport: {
        parse: data => {
          return data.subAcctList || []
        },
        read: () => {return {url:'/acct/subacctinfo/getsubacctlist.json', data: {pageSize: 10, pageIndex:0, subAcctRange: 0}}} // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '账号',
        name: 'userName'
      }, {
        text: '个人余额(大于)',
        name: 'balanceStart',
        validation: {
          rules: ['minValue::0', 'maxValue::1000000000'],
          errorMsg: '个人余额数额不符合要求'
        }
      }, {
        text: '个人余额(小于)',
        name: 'balanceEnd',
        validation: {
          rules: ['minValue::{balanceStart}', 'maxValue::1000000000'],
          errorMsg: '个人余额数额不符合要求'
        }
      }, {
        text: '不活跃天数≥',
        name: 'unActiveDays',
        validation: {
          rules: ['minValue::0', 'maxValue::10000'],
          errorMsg: '不活跃天数不符合要求'
        }
      }, {
        type: 'select',
        text: '查询范围',
        name: 'subAcctRange',
        defaultValue: 0,
        selection: [{
          value: '0',
          option: '直属下级'
        }, {
          value: '1',
          option: '全部下级'
        }]
      }, {
        text: '注册日期(起)',
        name: 'regTimeStart',
        class: 'date-input-start',
        defaultValue: new Date().toString('yyyy-MM-dd'),
        readonly: true
      }, {
        text: '注册日期(止)',
        name: 'regTimeEnd',
        class: 'date-input-end',
        defaultValue: new Date().toString('yyyy-MM-dd'),
        readonly: true
      }]
    }

  }

  componentDidMount () {
    this.props.setTitle('下级管理');
    $(window).on('hashchange.temp', (e) => {
      let userParentId = _.getQuery('userParentId', e.newUrl)
      if (!_.getQuery('name', e.newUrl)) {
        this.props.setTitle('下级管理');
      }
      this.props.filter(this.tableId, {
        url: '/acct/subacctinfo/getsubacctlist.json',
        data: {
          userParentId: userParentId,
          pageSize:10,
          pageIndex:0,
          subAcctRange: 0
        }
      });
    });
    this.loaded();
  }

  componentWillUnmount () {
    $(window).off('hashchange.temp')
  }

  render () {
    return (
        <div>
          {this.props.children || <div className="llm-lowLevelManage">
            <Table id={this.tableId} config={ this.tableConfig } />
          </div>}
        </div>
    )
  }
}

module.exports = LowLevelManage