import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './HandOpen.css'
import Button from 'components/Button'
import Table from 'components/Table'
import { filter } from 'redux/modules/table'
import { setTitle } from 'redux/modules/toolbar'
import { setRightButton } from 'redux/modules/toolbar'

@connect(
  state => ({user: state.auth.user}),
  {...actions, filter, setTitle,
    setRightButton,}
)
@withStyles(styles)
class HandOpen extends Page {
  constructor (props) {
    super(props);

    this.rebate = 0;
    let defaultRebate = '';
    let rebateReadonly = false;
    if (props.user && props.user.root && props.user.root.merchant) {
      defaultRebate = 13;
      rebateReadonly = true;
    }

    this.formConfig = {
      class: 'oa-form',
      fields: [
        {
          text: '用户名',
          name: 'userName',
          type: 'text',
          placeHolder: '',
          tip: '4-16个字符，支持英文和数字，不能以数字开头',
          validation: {
            rules: ['required'],
            errorMsg: '用户名不符合要求'
          }
        },
        {
          text: '密码',
          name: 'loginPwd',
          type: 'password',
          tip: '6-20位字符组成，区分大小写，不能使用空白符',
          validation: {
            rules: ['required', 'minLength::6', 'maxLength::20', 'pattern::^[^\\s]?[\\S]*[^\\s]?$'],
            errorMsg: '密码不符合要求'
          }
        },
        {
          text: '确认密码',
          name: 'loginPwd2',
          type: 'password',
          tip: '再次输入密码',
          validation: {
            rules: ['equalTo::{loginPwd}', 'required'],
            errorMsg: '确认密码与密码必须相同'
          }
        },
        {
          text: '下级返点',
          name: 'rebate',
          type: 'text',
          defaultValue: defaultRebate,
          readonly: rebateReadonly,
          addon: {
            after: '%'
          },
          tip: (data) => {
            return `可配置范围(${(data.rebateMin || 0)} - ${(data.rebateMax || 0)})`
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
          }
          return data && data.root.seriesList && data.root.seriesList.subRebateRange || []
        },
        format: data => {
          data.rebate = _.mul(data.rebate, 10);
          return data;
        },
        read: '/acct/subaccount/getsubacct.json',
        save: '/acct/subaccount/savesubacct.json'
      },
      controls: [
        {
          type: 'submit',
          text: '立即开户',
          className: 'btn-red waves-light btn-large'
        }
      ],
      events: {
        onSubmit: (data, callback) => {
          this.loading();
          ajax({
            url: '/acct/userinfo/userexist.json',
            data: {
              username: data.userName
            }
          }, res => {
            if (res && res.result === 0) {
              callback();
            } else {
              this.loaded();
            }
          }, err => {
            this.loaded();
            window.Alert({
              type: 'confirm',
              title: '',
              content: err.msg,
              noCancel: true,
              callback: () => {
                $('input[name="userName"]').val('');
              }
            });
          });
        },
        onChange: (name) => {
          if (props.user && props.user.root && !props.user.root.merchant) {
            if (name === 'rebate') {
              this.rebate = $('input[name="rebate"]').val() || 0;
              this.props.filter(this.tableId);
            }
          }
        },
        onSave : () => {
          this.loaded();
          window.Alert({
            type: 'confirm',
            title: '',
            content: '开户成功',
            noCancel: true,
            callback: () => {
              $('input[name="userName"]').val('');
              $('input[name="loginPwd"]').val('');
              $('input[name="loginPwd2"]').val('');
              $('input[name="rebate"]').val(defaultRebate);
            }
          });
        }
      }
    };

    if (props.user && props.user.root && !props.user.root.merchant) {
      this.tableConfig = {
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
            return data.seriesList && data.seriesList.ticketSeriesList || []
          },
          read: '/acct/subaccount/getsubacct.json' // url or function with all callback param
        }
      };

      this.tableId = window.keyGenerator();
    }
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
    this.props.setRightButton(<span />);
    ajax({url: '/acct/subaccount/getsubacct.json'}, (res) => {
      if (res && res.result === 0 && res.root.quotaList && res.root.quotaList.length) {
        var helpHtml = '<div class="help-block"><div class="help-img"><img src={require("images/icon/eclaim.png")}></div><div class="help-text">您目前拥有';
        _.each(res.root.quotaList, quota => {
          helpHtml += _.div(quota.quotaLevel, 10) + '配额' + quota.quotaLimit +'个，';
        });
        helpHtml += '此后奖金组配额无限制，有配额限制请使用手动开户。</div></div>';
        $('form').before(helpHtml);
      }}, (res) => {

    });
  }

  render () {
    return (
        <div className="form-container">
          <Form config = {this.formConfig} />
          {this.props.user && this.props.user.root && !this.props.user.root.merchant ?
            <section className="collapse-view">
              <div>
                <input id="ac-1" name="accordion-1" type="checkbox" />
                <label htmlFor="ac-1" className="collapse-btn"><i className="fa fa-angle-down"></i>查看奖金详情<i className="fa fa-angle-down"></i></label>
                <article className="collapse-content">
                  <Table id={this.tableId} config={this.tableConfig} />
                </article>
              </div>
            </section>
          : <span></span>}
        </div>
    )
  }
}

module.exports = HandOpen