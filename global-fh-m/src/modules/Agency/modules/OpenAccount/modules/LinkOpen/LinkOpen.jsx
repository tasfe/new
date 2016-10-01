import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './LinkOpen.css'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'
import List from 'components/List'
import ListItem from 'components/List/Items/OpenAcct'
import { setTitle } from 'redux/modules/toolbar'
import { setRightButton } from 'redux/modules/toolbar'

@connect(
  state => ({}),
  {...actions, pushState: routerActions.push, filter, setTitle,
    setRightButton,}
)

@withStyles(styles)

class LinkOpen extends Page {
  constructor () {
    super();
    this.rebate = 0;
    var self = this;
    this.state = {
      linkList: []
    };

    this.table1Config = {
      className: 'seriesList-table',
      columns: [{
        title: '彩种系列',
        name: 'sericeName'
      }, {
        title: '最高奖金',
        name: 'maxBonus',
        format: (value, data) => {
          value = this.calculateMaxBonus(data.sericeName, this.rebate, data.maxBonus);
          return _.convert2yuan(value);
        }
      }],
      transport: {
        parse: data => {
          return data && data.seriesList && data.seriesList.ticketSeriesList || data
        },
        read: '/acct/subaccount/getsubacct.json' // url or function with all callback param
      }
    };

    this.formConfig = {
      class: 'oa-form',
      fields: [
        {
          text: '备注',
          name: 'linkDes',
          type: 'text'
        },
        {
          text: '下级返点',
          name: 'rebate',
          type: 'text',
          addon: {
            after: '%'
          },
          tip: (data) => {
            return `${(data.rebateMin || 0)} - ${(data.rebateMax || 0)}`
          },
          validation: {
            rules: ['required', 'maxValue::{rebateMax}', 'minValue::{rebateMin}'],
            errorMsg: '返点值超出范围'
          }
        },
        {
          text: '',
          name: 'linkId',
          type: 'text',
          hidden: true,
        },
        {
          text: '',
          name: 'linkUrl',
          type: 'text',
          hidden: true,
        },
      ],
      transport: {
        parse: data => {
          if (data && data.root.seriesList && data.root.seriesList.subRebateRange) {
            data.root.seriesList.subRebateRange.rebateMax = _.div(data.root.seriesList.subRebateRange.rebateMax || 0, 10);
            data.root.seriesList.subRebateRange.rebateMin = _.div(data.root.seriesList.subRebateRange.rebateMin || 0, 10);
            (data.root.seriesList.subRebateRange.rebateMax > 12.4) ? (data.root.seriesList.subRebateRange.rebateMax = 12.4) : (data.root.seriesList.subRebateRange.rebateMax)
          }
          return data && data.root.seriesList && data.root.seriesList.subRebateRange || []
        },
        format: data => {
          data = {
            'link[0].linkId': data.linkId || '',
            'link[0].linkUrl': data.linkUrl || '',
            'link[0].linkDes': data.linkDes,
            'link[0].subAcctRebate': _.mul(data.rebate, 10)
          };
          return data;
        },
        read: '/acct/subaccount/getsubacct.json',
        save: '/acct/subaccount/savesubacctlink.json'
      },
      controls: [
        {
          type: 'submit',
          text: '生成链接',
          className: 'btn-red waves-light  width-42 margin-h-sm'
        },
        {
          type: 'cancel',
          text: '取消',
          className: ' waves-light  width-42 margin-h-sm btn-white'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
        },
        onChange: (name) => {
          if (name === 'rebate') {
            this.rebate = $('input[name="rebate"]').val() || 0;
            this.props.filter(this.table2Id);
          }
        },
        onSave : () => {
          let self = this;
          this.loaded();
          this.props.filter(this.tableId);
          this.refreshLinkList();
          window.Alert({
            type: 'confirm',
            title: '',
            content: '生成成功',
            noCancel: true,
            callback: () => {
              $('input[name="linkDes"]').val('');
              $('input[name="rebate"]').val('');
              $('input[name="linkId"]').val('');
              $('input[name="linkUrl"]').val('');
              $('.js-addForm').addClass('hidden');
              $('.js-linkList').removeClass('hidden');
            }
          });
        },
        onError: (data) => {
          window.Alert({
            title: '系统提示',
            content: data.root||'请求失败'
          });
        },
        onCancel: () => {
          $('input[name="linkDes"]').val('');
          $('input[name="rebate"]').val('');
          $('input[name="linkId"]').val('');
          $('input[name="linkUrl"]').val('');
          $('.js-addForm').addClass('hidden');
          $('.js-linkList').removeClass('hidden');
        }
      }
    };

    this.tableId = window.keyGenerator();
    this.table2Id = window.keyGenerator();

    ajax({url: '/acct/subaccount/getsubacctlink.json'}, (res) => {
      this.loaded();
      if (res && res.result === 0) {
        self.setState({linkList: res.root.linkList})
      }}, (res) => {
      this.loaded();
      if (res && res.result === 1) {
        window.Alert({
          title: '',
          content: '服务器异常'
        })
      }
    });
  }

  createLink () {
    $('.js-addForm').removeClass('hidden');
    $('.js-linkList').addClass('hidden');
  }

  refreshLinkList () {
    var self = this;
    ajax({url: '/acct/subaccount/getsubacctlink.json'}, (res) => {
      this.loaded();
      if (res && res.result === 0) {
        self.setState({linkList: res.root.linkList})
      }}, (res) => {
      this.loaded();
      if (res && res.result === 1) {
        window.Alert({
          title: '',
          content: '服务器异常'
        })
      }
    });
  }

  calculateMaxBonus (ticketName,rebate,maxBonus){
    var baseNum = 200000;
    if(ticketName === '十一选五'){
      baseNum = 198000;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  }

  componentDidMount () {
    this.props.setTitle('开户管理');
    this.props.setRightButton(<button className="toolbar-rightBtn" onClick={::this.createLink}>新增链接</button>)
    ajax({
      url: '/acct/subaccount/getsubacct.json'
    }, (res) => {
      if (res && res.result === 0 && res.root.quotaList && res.root.quotaList.length) {
        var helpHtml = '<div class="help-block"><div class="help-img"><img src="images/eclaim.png"></div><div class="help-text">您目前拥有';
        _.each(res.root.quotaList, quota => {
          helpHtml += _.div(quota.quotaLevel, 10) + '配额' + quota.quotaLimit +'个，';
        });
        helpHtml += '此后奖金组配额无限制，有配额限制请使用手动开户。</div></div>';
        $('form').before(helpHtml);
      }},
      (res) => {

      });
  }

  render () {
    return (
      <div className="form-container">
        <div className="js-addForm hidden">
          <Form config = {this.formConfig} />
          <section className="collapse-view">
            <div>
              <input id="ac-1" name="accordion-1" type="checkbox" />
              <label htmlFor="ac-1" className="collapse-btn"><i className="fa fa-angle-down"></i>查看奖金详情<i className="fa fa-angle-down"></i></label>
              <article className="collapse-content">
                <Table id={this.table2Id} config={ this.table1Config } />
              </article>
            </div>
          </section>
        </div>
        <List data={this.state.linkList} item={ListItem} claxx="iForm-list js-linkList linkList-container" itemClass="help-li" />
      </div>
    )
  }
}

module.exports = LinkOpen