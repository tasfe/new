import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import Form from 'components/Form'
import WithStyles from 'with-style'
import styles from './Withdraw.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
//import * as BankCardAction from  'redux/modules/User/bankCard'
import { routerActions } from 'react-router-redux';
import Tile from 'components/Tile'
import { setTitle } from 'redux/modules/toolbar'
import { setRightButton } from 'redux/modules/toolbar'

@connect(
  state => ({
    user: state.auth.user
  }),
  {
    setTitle,
    setRightButton,
    ...actions,
    pushState: routerActions.push,
  }
)

@WithStyles(styles)
class Withdraw extends Page {

  constructor () {
    super();
    var self = this;
    this.tileStyle = {
      img: {
        margin: '0.1rem',
      },
      text: {
        margin: '0.1rem'
      }
    };

    ajax({url: '/fund/withdraw/info.json'}, (res) => {
      this.loaded();
      if (res && res.result === 0) {
        self.setState({
          hasBankCard: res.root.hasBankCard,
          hasMoneyPwd: res.root.hasMoneyPwd,
          hasSecurity: res.root.hasSecurity,
          cardList: res.root.cardList,
          question: res.root.question,
          securityId: res.root.securityId,
          keyAmount: res.root.keyAmount,
          validBalance: res.root.validBalance,
          remainTimes: res.root.remainTimes,
      });
    }}, (res) => {
      this.loaded();
      if (res && res.result === 1) {
        window.Alert({
          title: '',
          content: '服务器异常'
        })
      }
    });

    this.state = {
      slideIndex: 0
    };
  }
 
  componentDidMount () {
    this.props.setTitle('提现');
    this.props.setRightButton(<a className="toolbar-rightBtn" href="/#/user/bankcard">新增绑卡</a>)
  }

  //componentWillReceiveProps(nextProps) {
  //
  //}

  render () {
    let self = this;

    if (!_.isUndefined(this.state.hasBankCard) && !this.state.hasBankCard) {
      console.log('没有银行卡');
      this.tile1Config = {
        title: '您还未绑定银行卡，无法进行提现操作',
        content: '前去绑定银行卡 >',
        onclick: () => {
          window.setTimeout(function () {
            self.props.pushState('/user/bankcard');
          }, 800);
        }
      };
    }

    if (!_.isUndefined(this.state.hasMoneyPwd) && !this.state.hasMoneyPwd) {
      console.log('没有资金密码');
      this.tile2Config = {
        title: '您还未设置资金密码，无法进行提现操作',
        content: '前去设置资金密码 >',
        onclick: () => {
          window.setTimeout(function () {
            self.props.pushState('/user/pm?tabindex=1');
          }, 800);

        }
      };
    }

    if (!_.isUndefined(this.state.hasSecurity) && !this.state.hasSecurity) {
      console.log('没有安全问题');
      this.tile3Config = {
        title: '您还没有设置安全问题，无法进行提现操作',
        content: '前去设置安全问题 >',
        onclick: () => {
          window.setTimeout(function () {
            self.props.pushState('/user/sqm?tabindex=0');
          }, 800);

        }
      };
    }

    if (this.state.hasBankCard && this.state.hasMoneyPwd && this.state.hasSecurity && this.state.cardList) {
      console.log('三个都有');
      let cardListConfig = [];
      _.each(this.state.cardList, (card) => {
        cardListConfig.push({
          option: card.bankName + ' ' + card.cardNo + (card.canWithdraw? '' : '(不可用)'),
          value: card.cardId,
          data: {
            maxmoneylimit: card.maxMoneyLimit,
            minmoneylimit: card.minMoneyLimit
          }
        });
      });

      this.formConfig = {
        class: 'withdraw-form',
        fields: [
          {
            text: '提现银行卡',
            name: 'cardId',
            type: 'select',
            defaultValue: this.state.cardList[0].cardId,
            selection: cardListConfig
          },
          {
            text: '提现金额',
            name: 'amount',
            type: 'text',
            addon: {
              after: '元'
            },
            tip: '单笔最低提现金额300元',
            validation: {
              rules: ['required','pattern::^[1-9]\\d*$'],
              errorMsg: '请输入正确的充值金额，必须为整数金额'
            }
          },
          {
            text: '安全问题',
            name: 'question',
            type: 'text',
            defaultValue: this.state.question,
            readonly: true
          },
          {
            text: '答案',
            name: 'answer',
            type: 'text',
          },
          {
            text: '',
            name: 'securityId',
            defaultValue: this.state.securityId,
            hidden: true,
          }
        ],
        transport: {
          format: (data) => {
            data.type = 'withdraw';
            data.payPwd = this.state.payPwd || this.pwd;
            data.device = 3;
            return data;
          },
          save: '/fund/withdraw/withdraw.json'
        },
        controls: [
          {
            type: 'submit',
            text: '申请提现',
            className: 'btn-red waves-light border-radius btn-large'
          }
        ],
        events: {
          onSubmit: data => {
            var withdraw = $('input[name="amount"]').val();
            var maxlimit = _.convert2yuan($('select option:selected').data('maxmoneylimit'));
            var minlimit = _.convert2yuan($('select option:selected').data('minmoneylimit'));
            if (withdraw <= maxlimit && withdraw >= minlimit) {

            } else {
              window.Alert({
                title: '',
                content: '超出此卡限额, 此卡限额' + minlimit + '元-' + maxlimit + '元'
              });
              $('input[name="amount"]').val('');
              return false;
            }
          }, // you can prevent the default behavior by return false
          onChange: () => {},
          onSave: () => {
            var withdraw = $('input[name="amount"]').val();
            window.Alert({
              type: 'confirm',
              title: '提现完成',
              content: '成功从您的账户中提现'+withdraw+'元',
              noCancel: true,
              callback: () => {
                self.props.pushState('/history/cash');
              }
            });
          },
          onError: (errorData) => {
            window.Alert({
              title: '',
              content: (errorData.msg?  (errorData.msg + '（新绑定的提款银行卡需要3小时后才能发起提款。）') : '服务器异常')
            });

          }
        }
      };

      this.formConfig2 = {
        class: 'payPwd-form',
        fields: [
          {
            text: '资金密码',
            name: 'payPwd',
            type: 'password',
            validation: {
              rules: ['required'],
              errorMsg: '请输入资金密码'
            }
          }, {
            text: '',
            name: 'type',
            defaultValue: '1',
            hidden: true,
          }
        ],
        transport: {
          save: '/fund/moneypd/verify.json'
        },
        controls: [
          {
            type: 'submit',
            text: '下一步',
            className: 'btn-red waves-light border-radius btn-large'
          }
        ],
        events: {
          onSubmit: (data) => {
          },
          onSave: () => {
            this.loaded();
            this.pwd = $('input[name="payPwd"]').val();
            this.setState({
              slideIndex: 1
            });
            $('.panel1').addClass('hidden');
            $('.panel2').removeClass('hidden');
          },
          onError: (errorData) => {
            if (errorData && errorData.result === 1) {
              window.Alert({
                title: '',
                content: errorData.msg || '资金密码不正确，请重新输入'
              });
            } else {
              window.Alert({
                title: '',
                content: errorData.msg || '服务器异常'
              });
            }

          }
        }
      };
    }

    return (
      <div>
        {
          this.tile1Config? <div className="withdraw-container">
            <img src="images/withdraw-card.png" style={this.tileStyle.img}/>
            <p style={this.tileStyle.text}>{this.tile1Config.title}</p>
            <button className="waves-effect btn btn btn-red waves-light btn-large" onClick={::this.tile1Config.onclick}>立即设定</button>
          </div> :
          (this.tile2Config? <div className="withdraw-container">
            <img src="images/withdraw-pwd.png" style={this.tileStyle.img}/>
            <p style={this.tileStyle.text}>{this.tile2Config.title}</p>
            <button className="waves-effect btn btn btn-red waves-light btn-large" onClick={::this.tile2Config.onclick}>立即设定</button>
          </div> :
          (this.tile3Config? <div className="withdraw-container">
            <img src="images/withdraw-sq.png" style={this.tileStyle.img}/>
            <p style={this.tileStyle.text}>{this.tile3Config.title}</p>
            <button className="waves-effect btn btn btn-red waves-light btn-large" onClick={::this.tile3Config.onclick}>立即设定</button>
          </div> : ''))
        }
        {(this.state.hasBankCard && this.state.hasMoneyPwd && this.state.hasSecurity && this.props.user.root.userStatus != 100)? (
            <div>
              <div className="panel1">
                <Form config={this.formConfig2} />
              </div>
              <div className="panel2 hidden">
                <div className="info-block">
                  <div>用户名： <span>{this.props.user.root.username}</span></div>
                  <div className="inline-block">账户余额： <span className="withdraw-balance">￥{_.convert2yuan(this.state.validBalance)}</span></div>
                  <div className="inline-block">可提现金额：<span className="withdraw-balance">￥{_.convert2yuan(this.props.user.root.balance)}</span></div>
                </div>
                <div className="withdraw-remainTimes">今日还可提现<span>{this.state.remainTimes}</span>次</div>
                <Form config={this.formConfig}/>
              </div>
            </div>
          ) : ''}
        {(this.props.user.root.userStatus === 100)? <div className="help-block">该用户已被冻结，无法进行提现操作。</div> : ''}
      </div>
    )
  }

}

module.exports = Withdraw