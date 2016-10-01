import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Rebate.css'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'

@connect(
  state => ({}),
  {...actions,
    pushState: routerActions.push,
    filter
  }
)

@withStyles(styles)

class Rebate extends Page {
  constructor () {
    super();
    var self = this;
    this.rebate = 0;
    this.tableId = window.keyGenerator();

    this.tableConfig = {
      columns: [{
        title: '彩种系列',
        name: 'sericeName'
      }, {
        title: '最高奖金',
        name: 'maxBonus',
        format: (value, data) => {
          value = this.calculateMaxBonus(data.sericeName, this.rebate, data.maxBonus);
          return _.convert2yuan(value)
        }
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      transport: {
        parse: data => {
          if (this.rebate == 0) {
            this.rebate = _.div(data.seriesList.subRebateRange.subAcctRebate || 0, 10);
          }
          return data.seriesList && data.seriesList.ticketSeriesList || []
        },
        read: () => { return {url:'/acct/subaccount/getsubacctrebate.json', data: {subAcctId: this.props.params.id}}} // url or function with all callback param
      }
    };

    this.formConfig = {
      class: 'oa-form',
      fields: [
        {
          text: '下级返点',
          name: 'subAcctRebate',
          type: 'text',
          tip: (data) => {
            return `可配置范围(${(data.rebateMin || 0)} - ${(data.rebateMax || 0)})`
          },
          addon: {
            after: '%'
          },
          validation: {
            rules: ['required', 'maxValue::{rebateMax}', 'minValue::{rebateMin}'],
            errorMsg: '返点值超出范围'
          }
        }
      ],
      transport: {
        parse: data => {
          if (data && data.root.seriesList && data.root.seriesList.subRebateRange) {
            data.root.seriesList.subRebateRange.rebateMax = _.div(data.root.seriesList.subRebateRange.rebateMax || 0, 10);
            data.root.seriesList.subRebateRange.rebateMin = _.div(data.root.seriesList.subRebateRange.rebateMin || 0, 10);
            data.root.seriesList.subRebateRange.subAcctRebate = _.div(data.root.seriesList.subRebateRange.subAcctRebate || 0, 10);
          }
          return data && data.root.seriesList && data.root.seriesList.subRebateRange || []
        },
        format: data => {
          data.subAcctRebate = _.mul(data.subAcctRebate, 10);
          data.subAcctId = this.props.params.id;
          return data;
        },
        read: () => {return {url:'/acct/subaccount/getsubacctrebate.json', data: {subAcctId: this.props.params.id}}},
        save: '/acct/subaccount/modifySubAcctRebate.json'
      },
      controls: [
        {
          type: 'submit',
          text: '保存修改',
          className: 'btn-red waves-light btn-large'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
          //return  {
          //  subAcctId: this.props.params.id,
          //  subAcctRebate: (data.subAcctRebate * 10)
          //}
          console.log(data);
        },
        onChange: (name) => {
          if (name === 'subAcctRebate') {
            this.rebate = $('input[name="subAcctRebate"]').val() || 0;
            this.props.filter(this.tableId);
          }
        },
        onSave: () => {
          this.loaded();
          window.Alert({
            type: 'confirm',
            title: '',
            content: '修改成功',
            noCancel: true,
            callback: () => {
              self.props.pushState('/agency/llm');
            }
          });
        },
        onError: () => {
          window.Alert({
            type: 'confirm',
            title: '',
            content: '修改失败',
            noCancel: true,
            callback: () => {
              self.props.pushState('/agency/llm');
            }
          });
        }
      }
    };

  }

  calculateMaxBonus (ticketName,rebate,maxBonus){
    var baseNum = 200000;
    if(ticketName === '十一选五'){
      baseNum = 198000;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  }

  componentDidMount () {
    this.props.setTitle('编辑返点')
  }

  render () {
    return (
        <div className="form-container">
          <Form config = {this.formConfig} />
          <Table id={this.tableId} config={ this.tableConfig } />
        </div>
    )
  }
}

module.exports = Rebate