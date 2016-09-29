import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Loss.css'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@withStyles(styles)

class Loss extends Page {
  constructor () {
    super();

    this.myDate = new Date();
    this.myDate.setDate(this.myDate.getDate() - 1);
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    this.tableConfig = {
      pagable: true,
      columns: [{
        title: '账号',
        name: 'consumeUser',
        format: (value, data) => {
          return value
        }
      }, {
        title: '关系',
        name: 'relationship'
      }, {
        title: '消费金额',
        name: 'consumeAmount',
        format: (value, data) => {
          return _.fixedConvert2yuan(value);
        }
      }, {
        title: '佣金',
        name: 'commissionAmount',
        format: (value, data) => {
          return _.fixedConvert2yuan(value);
        }
        //}, {
        //  title: '操作',
        //  name: 'operation',
        //  format: (value, data) => {
        //    return <a href="#">查看投注</a>
        //  }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      transport: {
        parse: data => {
          return data.detailList
        },
        read: () => {
          return {
            url:'/info/agentCommission/list.json',
            data: {
              commissionDate: this.formatDate,
              type: 2,
              pageSize: 10,
              pageIndex: 0
            }
          }
        } // url or function with all callback param
      },
      filters: [{ // same with form setting
        text: '统计日期',
        name: 'commissionDate',
        class: 'date-input',
        defaultValue: this.formatDate,
        readonly: true
      }, {
        text: '用户名',
        name: 'commissionUserName',
        class: 'commission-userName'
      }]
    };

  }

  componentDidMount () {
    this.props.setTitle('佣金统计');
  }

  openIntro () {
    ajax({url: '/info/agentCommission/commcfgdetail.json'}, (res) => {
      if (res && res.result === 0 && res.root.profitList && res.root.profitList.length) {
        var helpHtml = '<p>佣金规则：</p>';
        _.each(res.root.profitList, (prof, index) => {
          helpHtml += '<p>' + (index+1) + '、每亏损<span class="text-danger">≥' + _.convert2yuan(prof.profit) + '</span>元,上级获得<span class="text-danger">' + _.convert2yuan(prof.curHigherComVal) +'</span>元，上上级获利<span class="text-danger">' + _.convert2yuan(prof.indirectHigherComVal) + '</span>元。</p>';
        });
        helpHtml += '<p>每日1点系统自动将前一日佣金转入您的账户。</p>';
        window.Alert({
          title: '亏损佣金说明',
          content: helpHtml,
          type: 'confirm',
          noCancel: true,
          callback: () => {
          }
        });
      }}, (res) => {

    });
  }

  render () {
    return (
      <div className="co-commission" style={{height:'100%'}}>
        <div className="help-block"><div className="help-text"><a className="commission-intro" onClick={::this.openIntro}>亏损佣金说明 ></a></div></div>
        <Table config={this.tableConfig} />
      </div>
    )
  }
}

module.exports = Loss