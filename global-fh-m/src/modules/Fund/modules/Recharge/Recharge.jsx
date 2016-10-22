import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import Form from 'components/Form'
import Tab from 'components/Tab'
import WithStyles from 'with-style'
import styles from './Recharge.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import QuickPayConfig from './quickPayConfig'
import * as BankCardAction from  'redux/modules/User/bankCard'
import * as FundAction from  'redux/modules/User/fundPwd'
import { routerActions } from 'react-router-redux';
import { cookie } from 'storeUtil'
import BankConfig from 'modules/User/modules/Bankcard/bankConfig'
import { setLeftButton } from 'redux/modules/toolbar'
import Tile from 'components/Tile'

@connect(
  state => ({
    cardList: state.bankCard.cardList,
    locked: state.bankCard.locked
  }),
  {
    ...actions,
    ...BankCardAction,
    ...FundAction,
    pushState: routerActions.push,
    setLeftButton
  }
)
@WithStyles(styles)
class Recharge extends Page {

  constructor () {
    super()
    this.state = {paymentList: {}};
  }

  componentWillMount() {

    let self = this;
    ajax({url: 'fund/recharge/rechargetype.json',data:{wap:1}}, function(res) {
      if (res && res.result === 0) {
        let fields = []
        _(res.root.paymentList).each(function(payment,index){
          let paymentInfo = QuickPayConfig.get(payment.paymentType);
          let field = {title: paymentInfo.zhName, content: '', id: payment.paymentType, pic: paymentInfo.pic}
          fields.push(field)
        })

        self.setState({
          loadSucc: res,
          paymentList: res.root.paymentList,
          // hasBankCard: res.root.hasBankCard,
          // hasMoneyPwd: res.root.hasMoneyPwd,
          fields: fields
        });

      }
      self.loaded();
    }, function(res) {
      self.setState({
        checkError: res,
      });
      window.Alert({
        title: '系统提示',
        content: res.msg||'请求失败！',
      })
      self.loaded();
    })
  }
 
  componentDidMount () {
    this.props.setTitle('充值')
    this.props.setLeftButton(true);
    //this.verify(['moneyPassword'])
  }

  componentDidUpdate(){
    this.bindEvent()
    return false;
  }

  render () {
    let self = this;
    let loadSucc = this.state.loadSucc;
    let children = this.props.children;
    let checkError = this.state.checkError;
    let dis = 'none';

    let token = cookie.getCookie('user_token') || '';

    this.tabConfig = {
      fields: this.state.fields
    }

    return (<div>
      {loadSucc &&
      <div>
        <div className="f-recharge-tab">
          {!_(this.tabConfig.fields).isEmpty() &&
            <Tab config={this.tabConfig}/>
          }
        </div>
        <form className="js-fc-re-form " action="/fund/recharge/dopaymentrecharge" method="post" target="_blank">
          <div className=" ">
            <table className="js-fc-re-bankList fc-re-bankList">
              <tbody>
              {!_(this.tabConfig.fields).isEmpty() &&
                <tr>
                  <td className="js-fc-re-bank fc-re-bank active" data-type="1" data-code="3001"><span className="fc-re-bank-zhaoshang">招商银行</span></td>
                  <td className="js-fc-re-bank fc-re-bank" data-type="2" data-code="3002"><span className="fc-re-bank-gongshang">工商银行</span></td>
                  <td className="js-fc-re-bank fc-re-bank" data-type="3" data-code="3003"><span className="fc-re-bank-jianshe">建设银行</span></td>
                  <td className="js-fc-re-bank fc-re-bank" data-type="4" data-code="3005"><span className="fc-re-bank-nongye">农业银行</span></td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          <div className="fc-re-div2">
            <ul className="iForm-list" >
              <li className="list-item" >
                <label className="iForm-list-inner" >
                  <span className="label" >充值金额</span>
                  <span className="iForm-inner-span" >
                    <span >&nbsp;</span>
                    <span>元</span>
                  </span>
                  <input type="text"  name="amount" placeholder="" readOnly="" className="js-fc-re-amount " onChange={::this.amountChange} />
                </label>
                <div className="error-message-container" style={{display:dis}}  data-reactid=".0.1.0.0.0.0.0.$xpkx4j9k9.2">请输入符合要求的的金额</div>
              </li>
              </ul>
            <div className=" m-bottom-md">
              <ul className="js-fc-re-quickAmounts fc-re-quickAmount">
                {!_(this.tabConfig.fields).isEmpty() &&
                  <li className="js-ac-statistic-type " data-type="1">1</li>
                }
              </ul>
            </div>
        </div>

          <div className="iForm-controls padding-h-sm" >
            <button type="button" className="waves-effect btn btn btn-red waves-light btn-large" onClick={::this.pay} >立即充值</button>
          </div>

          <input type="hidden" name="token" value={token}/>
          <input type="hidden" name="paymentType"/>
          <input type="hidden" name="paymentId"/>
          <input type="hidden" name="bankId"/>
          <input type="hidden" name="bankCode"/>
          <input type="hidden" name="wap" value="1"/>
        </form>
        </div>
      }
      </div>)
  }

  pay(){
    let $form = $('.js-fc-re-form');
    if(this.amountChange()){
      $form.submit();
    }
  }

  initPaymentPage(e,paymentList) {
    let $target = $(e.currentTarget);
    let type = $target.data('id');
    $('input[name="paymentType"]').val(type);
    let payment = _(paymentList).filter(function(payment){
      return payment.paymentType===type;
    });
    $('input[name="paymentId"]').val(payment[0].paymentId);
    this.payment = payment[0];
    this.generateQuickAmount(payment[0].keyAmount);
    this.generateBankTab(payment[0])
    let maxAmount = _(payment[0].maxMoneyLimit).convert2yuan({fixed:0});
    let minAmount = _(payment[0].minMoneyLimit).convert2yuan({fixed:0});
    let $amount = $('.js-fc-re-amount');
    if(minAmount===0){
      minAmount = 1;
    }
    if(maxAmount===0){
      maxAmount = 1000000;
    }
    $amount.attr('data-parsley-range', '[' + minAmount + ',' + maxAmount + ']');
    $amount.attr('placeholder', '请输入' + minAmount + '到' + maxAmount + '之间的值');
    //
    //todo 去掉校验信息提示框
    //$('.tooltip').remove();
    //let $form = $('.js-fc-re-form');
    //$form.parsley().reset();
  }

  generateBankTab(payment) {
    if(payment.paymentType===1 || payment.paymentType===4){
      let bankList = payment.bankList;
      let html = [];
      _(bankList).each(function(bank,index){
        let bankInfo = BankConfig.get(bank.bankId);

        if((index+1)%4===1){
          html.push('<tr>')
        }
        html.push('<td class="js-fc-re-bank fc-re-bank '+(index===0?'active':'')+'" data-type="'+bankInfo.id+'" data-code="'+bank.bankCode+'">');
        html.push('<span class="'+bankInfo.className+'">'+bankInfo.zhName+'</span>');
        html.push('</td>');
        if((index+1)%4===0){
          html.push('</tr>')
        }
      });
      let n = _(bankList).size();
      let x = 4-n%4;

      if(x!==0){
        _(_(x).range()).each(function(item,index){
          if(index===0){
            html.push('<td class="js-fc-re-bank fc-re-bank " data-type=""><span>其他</span></td>');
          }else{
            html.push('<td></td>');
          }
        });
        html.push('</tr>')
      }
      $('.js-fc-re-bankList').html( html.join(''));
      $('.js-fc-re-bank').eq(0).trigger('click');
    }else{
      $('.js-fc-re-bankList').html( '');
    }
  }
  generateQuickAmount(keyAmount) {
    let self = this;
    let html = [];
    _(keyAmount).each(function(amount,index){
      html.push('<li class="js-ac-statistic-type " data-type="'+amount+'">');
      html.push(self.formatAmount(amount));
      html.push('</li>');
    });

    $('.js-fc-re-quickAmounts').html( html.join(''));
  }

  formatAmount (amount) {
    let str = new String(amount);
    let l = str.length;
    if(str.slice(l-4,l)==='0000'){
      str =  str.replace(/0000$/,'万');
    }else if(str.slice(l-3,l)==='000'){
      str =  str.replace(/000$/,'仟');
    }
    return str;
  }

  bindEvent(flag){
    let self = this;
    let paymentList = this.state.paymentList;
    //$('.js-fc-re-form').on('click', '.tabs-header li', {paymentList:paymentList}, ::this.tabClickHandler);
    $('.tabs-header li').on('click', {paymentList:paymentList}, ::this.tabClickHandler);
    $('.tabs-header li:first').trigger('click');
    $('.js-fc-re-form').on('click', '.js-fc-re-bank', ::this.bankClickHandler );
    $('.js-fc-re-form').on('click', '.js-ac-statistic-type', ::this.amountClickHandler);
  }
  tabClickHandler(e) {
    let $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');
    this.initPaymentPage(e,e.data.paymentList);
    //this.bindEvent(true);
    // return false;
  }

  bankClickHandler(e) {
    let $target = $(e.currentTarget);
    $('.js-fc-re-bankList').find('td').removeClass('active');
    $target.addClass('active');
    let bankId = $target.data("type");
    let bankCode = $target.data("code");
    $('input[name="bankId"]').val(bankId);
    $('input[name="bankCode"]').val(bankCode);
    return false;
  }
  amountClickHandler(e) {
    let $target = $(e.currentTarget);
    let amount = $target.data('type');
    $('.js-fc-re-amount').val(amount);
    return false;
  }

  amountChange(){
    let $amount = $('.js-fc-re-amount');
    let val = $amount.val();
    let $err = $amount.parent().siblings('.error-message-container');
    let range = $amount.attr('data-parsley-range');
    let flag = false;
    let myReg = /^\d+$/;
    if(myReg.test(val)){
      if(range){
        let arr = eval(range);
        if(_(arr).isArray() && arr.length===2){
          let min = arr[0];
          let max = arr[1];
          if(_(min).isNumber() && _(max).isNumber()){
            if(val>=min && val<=max){
              flag = true;
            }
          }else{
            flag = true;
          }
        }

      }else{
        flag = true;
      }
    }

    if(flag){
      $err.hide();
    }else{
      $err.show();
    }
    return flag;
  }
}

module.exports = Recharge