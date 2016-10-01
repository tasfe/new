import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Consum.css'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

@withStyles(styles)

class Consum extends Page {
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
              type: 1,
              pageSize: 10,
              pageIndex: 0
            }
          }
        }
      },
      filters: [{
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
      if (res && res.result === 0 && res.root.salesList && res.root.salesList.length) {
        var helpHtml = '<p>佣金规则：</p>';
        _.each(res.root.salesList, (sales, index) => {
          helpHtml += '<p>' + (index+1) + '、每消费<span class="text-danger">≥' + _.convert2yuan(sales.salesVolume) + '</span>元,上级获得<span class="text-danger">' + _.convert2yuan(sales.curHigherComVal) +'</span>元，上上级获利<span class="text-danger">' + _.convert2yuan(sales.indirectHigherComVal) + '</span>元。</p>';
        });
        helpHtml += '<p>每日1点系统自动将前一日佣金转入您的账户。</p>';
        window.Alert({
          title: '消费佣金说明',
          content: helpHtml,
          type: 'confirm',
          noCancel: true,
          callback: () => {
          }
        });
      }}, (res) => {

    });
  }

  //content: '<p>佣金规则：</p><p>1、每消费<span class="text-danger">≥599</span>元，上级获得<span class="text-danger">5</span>元，上上级获利<span class="text-danger">3</span>元。</p> <p>2、每消费<span class="text-danger">≥2999</span>元，上级获得<span class="text-danger">12</span>元，上上级获利<span class="text-danger">8</span>元。</p> <p>3、每消费<span class="text-danger">≥9999</span>元，上级获得<span class="text-danger">24</span>元，上上级获利<span class="text-danger">16</span>元。</p><p>每日1点系统自动将前一日佣金转入您的账户。</p>',

  render () {
    return (
      <div className="co-commission" style={{height:'100%'}}>
        <div className="help-block"><div className="help-text"><a className="commission-intro" onClick={::this.openIntro}>消费佣金说明 ></a></div></div>
        <Table config={this.tableConfig} />
      </div>
    )
  }
}

module.exports = Consum