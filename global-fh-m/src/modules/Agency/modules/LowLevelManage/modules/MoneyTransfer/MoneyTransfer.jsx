import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import { routerActions } from 'react-router-redux';
import styles from './MoneyTransfer.css'
import Table from 'components/Table'
import Paper from 'components/Paper'
import Tile from 'components/Tile'

@connect(
  state => ({
    user: state.auth.user
  }),
  {...actions,
  pushState: routerActions.push
  })

@withStyles(styles)

class MoneyTransfer extends Page {
  constructor () {
    super();
    var self = this;

    this.formConfig = {
      class: 'transfer-form',
      fields: [
        {
          text: '可用金额',
          name: 'balance',
          type: 'text',
          readonly: true,
          format: (value, data) => {
            return (_.convert2yuan(value) + '元');
          }
        },
        {
          text: '转账金额',
          name: 'tradeMoney',
          type: 'text',
          tip: (data) => {
            return `转账金额${data.minMoney}元 - ${data.maxMoney}元`
          },
          addon: {
            after: '元'
          },
          validation: {
            rules: ['required', 'minValue::{minMoney}', 'maxValue::{maxMoney}'],
            errorMsg: '转账金额不符合要求'
          }
        },
        {
          text: '资金密码',
          name: 'moneyPwd',
          type: 'password',
          validation: {
            rules: ['required'],
            errorMsg: '资金密码不能为空'
          }
        }
      ],
      transport: {
        parse: data => {
          if (data && data.root) {
            data.root.maxMoney = _.convert2yuan(data.root.maxMoney);
            data.root.minMoney = _.convert2yuan(data.root.minMoney);
          }
          return data.root || {}
        },
        format: data => {
          _.extend(data, {'sub[0]': this.props.params.id});
          return data;
        },
        read: '/acct/subacctinfo/gettradeinfo.json',
        save: '/fund/transfer/transfer.json'
      },
      controls: [
        {
          type: 'submit',
          text: '确认转账',
          className: 'btn-red waves-light btn-large'
        }
      ],
      events: {
        onSubmit: (data) => {
          this.loading();
          console.log(data);
        },
        onChange: (value, data) => {},
        onSave: () => {
          this.loaded();
          window.Alert({
            type: 'confirm',
            title: '',
            content: '转账成功',
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
            content: '转账失败',
            noCancel: true,
            callback: () => {
              self.props.pushState('/agency/llm');
            }
          });
        }
      }
    };

  }

  componentDidMount () {
    this.props.setTitle('转账');
  }

  render () {
    var params = {};
    var match  = (this.props.location.search || window.location.hash).match(/#?.*\?(.*)/);

    _(match[1].split('&')).each(function(arg) {
      arg = arg.split('=');
      params[arg[0]] = decodeURI(arg[1]);
    });

    const style = {
      tile: {
        background: '#ad315c',
        color: '#000',
        width: '98%'
      }
    };

    let tileConfig = {
      tile:{
        title: '转账给:',
        content: params.name
      }
    };
    return (
        <div className="mt-form-container">
          {this.props.user.root.userStatus === 100? <div className="help-block"><div className="help-img"><img src="images/eclaim.png" /></div><div className="help-text">该用户已被冻结，无法进行转账操作。</div></div>:<Tile config = {tileConfig.tile} tileStyle = {style.tile} />}
          {this.props.user.root.userStatus === 100? '':<div className="mm-divider"></div>}
          {this.props.user.root.userStatus === 100? '':<Form config = {this.formConfig} />}
        </div>
    )
  }
}

module.exports = MoneyTransfer