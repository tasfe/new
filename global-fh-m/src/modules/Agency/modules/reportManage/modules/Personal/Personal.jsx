import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Personal.css'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title, user: state.auth.user}),
  actions
)

@withStyles(styles)

class Personal extends Page {
  constructor (props) {
    super(props);

    this.formatDate = new Date().toString('yyyy-MM-dd');

    this.tableConfig = {
      caption: '注意:只保留最近35天的报表查询。',
      columns: [{
        title: '日期',
        name: 'day'
      }, {
        title: '充值',
        name: 'recharge',
        format: (value, data) => {
          return _(value).convert2yuan({fixed:2, clear: false});
        }
      }, {
        title: '提现',
        name: 'withdraw',
        format: (value, data) => {
          return _(value).convert2yuan({fixed:2, clear: false});
        }
      }, {
        title: '投注',
        name: 'bet',
        format: (value, data) => {
          return _.fixedConvert2yuan(value);
        }
      }, {
        title: '中奖',
        name: 'prize',
        format: (value, data) => {
          return _(value).convert2yuan({clear: false});
        }
      }, {
        title: '返点',
        name: 'bonus',
        format: (value, data) => {
          return _(value).convert2yuan({clear: false});
        }
      }, {
        title: '活动',
        name: 'activity',
        format: (value, data) => {
          return _(value).convert2yuan({clear: false});
        }
      }, {
        title: '盈亏',
        name: 'profitAndLoss',
        format: (value, data) => {
          return _(value).convert2yuan({clear: false});
        }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      transport: {
        parse: data => {
          return data.amountList || []
        },
        read: () => {return {url:'/fund/fundreport/amountreport.json', data: {
          subUser: 0,
          startTime: this.formatDate,
          endTime: this.formatDate
        }}} // url or function with all callback param
      },
      command: [{
        text: '投注',
        link: (data) => {
          return `#/history/betting?name=${data.userName}&id=${data.userId}&tabindex=1`
        }
      }, {
        text: '账变',
        link: (data) => {
          return `#/history/account?name=${data.userName}&id=${data.userId}&tabindex=1`
        }
      }],
      filters: [{
        text: '用户名',
        name: 'username'
      },{ // same with form setting
        text: '查询日期(起)',
        name: 'startTime',
        placeHolder: '起始日期',
        class: 'date-input-start',
        defaultValue: this.formatDate,
        readonly: true
      }, {
        text: '查询日期(止)',
        name: 'endTime',
        placeHolder: '结束日期',
        class: 'date-input-end',
        defaultValue: this.formatDate,
        readonly: true
      }, {
        text: '彩种',
        name: 'ticketId',
        type: 'select',
        defaultValue: '',
        selection: [{
          value: '',
          option: '所有彩种'
        }, {
          value: '1',
          option: '重庆时时彩'
        }, {
          value: '2',
          option: '江西时时彩'
        }, {
          value: '3',
          option: '新疆时时彩'
        }, {
          value: '8',
          option: '天津时时彩'
        }, {
          value: '9',
          option: '黑龙江时时彩'
        }, {
          value: '10',
          option: '分分彩'
        }, {
          value: '5',
          option: '山东11选5'
        }, {
          value: '4',
          option: '广东11选5'
        }, {
          value: '11',
          option: '江西11选5'
        }, {
          value: '6',
          option: '福彩3D'
        }, {
          value: '7',
          option: 'P5/P3'
        }, {
          value: '12',
          option: '五分彩'
        }, {
          value: '13',
          option: '三分彩'
        }, {
          value: '14',
          option: '11选5分分彩'
        }, {
          value: '15',
          option: '11选5三分彩'
        }, {
          value: '16',
          option: '福彩3D分分彩'
        }, {
          value: '17',
          option: '福彩3D五分彩'
        }]
      }]
    }

    if (props.user && props.user.root && props.user.root.merchant) {
      var self = this;
      var bonus;
      _.map(this.tableConfig.columns, obj => {
        if (obj.name === "bonus") {
          self.tableConfig.columns = _.without(self.tableConfig.columns, obj);
        }
        if (obj.name === "activity") {
          obj.format = (value, data) => {
            return _(value + data.bonus).convert2yuan({clear: false});
          }
        }
      });
    }

  }

  componentDidMount () {
    this.props.setTitle('报表查询');
  }

  render () {
    return (
      <div className="rm-person">
        <Table config={ this.tableConfig } />
      </div>
    )
  }
}

module.exports = Personal