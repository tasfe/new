import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './ResetPassword.css'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux';
import Button from 'components/Button'
//import SwipeableViews from 'react-swipeable-views'

@WithStyles(styles)
@connect(state => ({
}), {
  pushState: routerActions.push
})
class ResetPassword extends Page {

  constructor () {
    super();
    //this.style = {
    //  slide: {
    //    padding: 15,
    //    height: 600
    //  },
    //  slideStyle: {
    //    height: '100%'
    //  }
    //};

    this.state = {
      slideIndex: 0
    };
  }

  componentDidMount () {
    this.loaded()
  }

  render () {

    return (
      <div className="padding-h-sm paddingtop">
        <div className="login-logo"></div>
        <div className="resetpwd-title-bar">
          <div className="resetpwd-title step1 active">1.输入账号和资金密码</div>
          <div className="resetpwd-title symbol"> &nbsp;&nbsp;<i className="fa fa-angle-right"></i>&nbsp;&nbsp; </div>
          <div className="resetpwd-title step2">2.重置登录密码</div>
          <div className="resetpwd-title-border"></div>
        </div>
        {<div>
          <div className="panel1 nobg">
            <div className="login-row row">
              <input className="ui-input border-radius" type="text" name="username" placeholder="输入用户名" />
              <i className="userName-loader fa fa-spinner fa-spin"></i>
              <i className="userName-check fa fa-check-circle"></i>
              <i className="userName-error fa fa-times-circle"></i>
            </div>
            <div className="login-row row"><input className="ui-input border-radius" type="password" name="payPwd" placeholder="请输入资金密码" onClick={::this.checkUserName} /></div>
            <input className="ui-input border-radius js-rp-tokenContainer" type="hidden" name="loginToken" />
            <div className="login-row row"><a className="contact-service" href="javascript:void(0);" onClick={::this.contactService}>未设置或忘记资金密码？</a></div>
            <div className="login-row row">
              <Button
                config={{
                text: '下一步',
                className: 'btn-red waves-light btn-large'
              }} onClick={::this.varifyPayPwd}/>
            </div>
            <div className="fogotpsd-tip">
              <Button config={{
              text: '返回登录页',
              className: 'btn-flat waves-light btn-large'
            }} onClick={::this.goToLogin} />
            </div>
          </div>
          <div className="panel2 nobg hidden">
            <div className="login-row row"><input className="ui-input border-radius" type="password" name="loginPwd" placeholder="请输入新的登录密码" /></div>
            <div className="loginPwd-error hidden"></div>
            <div className="login-row row"><input className="ui-input border-radius" type="password" name="loginPwdConfirm" placeholder="确认登录密码" /></div>
            <div className="loginPwdConfirm-error hidden"></div>
            <input ref="loginToken" className="ui-input border-radius js-rp-tokenContainer" type="hidden" name="loginToken" />
            <div className="login-row row">
              <Button
                config={{
                text: '提交',
                className: 'btn-red waves-light btn-large'
              }} onClick={::this.submitLoginPwd} />
            </div>
            <div className="fogotpsd-tip">
              <Button config={{
              text: '返回登录页',
              className: 'btn-flat waves-light btn-large'
            }} onClick={::this.goToLogin} />
            </div>
          </div>
        </div>}
        {
        //  <SwipeableViews index={this.state.slideIndex} onChangeIndex={this.handleChange}  disabled={true} slideStyle={this.style.slideStyle}>
        //    <div className="panel nobg" style={Object.assign({}, this.style.slide)}>
        //      <div className="login-row row">
        //        <input className="ui-input border-radius" type="text" name="username" placeholder="请输入您的账号" />
        //        <i className="userName-loader fa fa-spinner fa-spin"></i>
        //        <i className="userName-check fa fa-check-circle"></i>
        //        <i className="userName-error fa fa-times-circle"></i>
        //      </div>
        //      <div className="login-row row"><input className="ui-input border-radius" type="password" name="payPwd" placeholder="请输入资金密码" onClick={::this.checkUserName} /></div>
        //      <input className="ui-input border-radius js-rp-tokenContainer" type="hidden" name="loginToken" />
        //      <div className="login-row row"><a className="contact-service" href="javascript:void(0);" onClick={::this.contactService}>未设置或忘记资金密码？</a></div>
        //      <div className="login-row row">
        //        <Button
        //          config={{
        //          text: '下一步',
        //          className: 'btn-red waves-light btn-large'
        //        }} onClick={::this.varifyPayPwd}/>
        //      </div>
        //      <div className="fogotpsd-tip">
        //        <Button config={{
        //        text: '返回登录页',
        //        className: 'btn-flat waves-light btn-large'
        //      }} onClick={::this.goToLogin} />
        //      </div>
        //    </div>
        //    <div className="panel nobg" style={Object.assign({}, this.style.slide)}>
        //      <div className="login-row row"><input className="ui-input border-radius" type="password" name="loginPwd" placeholder="请输入新的登录密码" /></div>
        //      <div className="loginPwd-error hidden"></div>
        //      <div className="login-row row"><input className="ui-input border-radius" type="password" name="loginPwdConfirm" placeholder="确认登录密码" /></div>
        //      <div className="loginPwdConfirm-error hidden"></div>
        //      <input ref="loginToken" className="ui-input border-radius js-rp-tokenContainer" type="hidden" name="loginToken" />
        //      <div className="login-row row">
        //        <Button
        //          config={{
        //          text: '提交',
        //          className: 'btn-red waves-light btn-large'
        //        }} onClick={::this.submitLoginPwd} />
        //      </div>
        //      <div className="fogotpsd-tip">
        //        <Button config={{
        //        text: '返回登录页',
        //        className: 'btn-flat waves-light btn-large'
        //      }} onClick={::this.goToLogin} />
        //      </div>
        //    </div>
        //  </SwipeableViews>
        }
      </div>
    )
  }

  goToLogin (){
    let self = this;
    window.setTimeout(function () {
      self.props.pushState('/login');
    }, 600);
  }

  checkUserName () {
    var self = this;
    this.userNameVarified = false;
    this.$username = $('input[name="username"]');
    this.$payPwd = $('input[name="payPwd"]');
    this.$loginToken = $('.js-rp-tokenContainer');
    $('.userName-check').css('display', 'none');
    $('.userName-error').css('display', 'none');
    $('.userName-loader').css('display', 'inline-block');
    console.log(222)
    ajax({
      url: '/acct/login/verifyusername.json',
      data: {
        username: this.$username.val()
      }
    }, res => {
      if (res && res.result === 0) {
        $('.userName-loader').css('display', 'none');
        $('.userName-check').css('display', 'inline-block');
        $('.userName-error').css('display', 'none');
        self.$payPwd.focus();
        self.$loginToken.val(res.root.pwdToken);
        self.userNameVarified = true;
      }
    }, err => {
      window.Alert({
        type: 'confirm',
        title: '',
        content: err.msg,
        noCancel: true
      });
      $('.userName-loader').css('display', 'none');
      $('.userName-check').css('display', 'none');
      $('.userName-error').css('display', 'inline-block');
      self.userNameVarified = false;
      this.loaded();
    })
  }

  varifyPayPwd () {
    let activePos = $('.resetpwd-title.active').position();
    let step1Width = $('.resetpwd-title.step1').width();
    let stepSymbol = $('.resetpwd-title.symbol').width();
    if (this.userNameVarified) {
      ajax({
        url: '/fund/moneypd/verpwdforloginpwd.json',
        data: {
          username: this.$username.val(),
          payPwd: this.$payPwd.val(),
          loginToken: this.$loginToken.val()
        }
      }, res => {
        $('.resetpwd-title.step1').removeClass('active');
        $('.resetpwd-title.step2').addClass('active');
        $('.resetpwd-title-border').stop().css({
          left: activePos.left + step1Width + stepSymbol,
          width: $('.resetpwd-title.active').width()
        });
        $('.panel1').addClass('hidden');
        $('.panel2').removeClass('hidden');
        this.setState({
          slideIndex: 1
        });

      }, err => {
        window.Alert({
          type: 'confirm',
          title: '',
          content: err.msg,
          noCancel: true
        });
      });
    }

  }

  validateLoginPwd () {
    var password = $('input[name="loginPwd"]').val();
    var $error = $('.loginPwd-error');
    var myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
    var msg = [];
    if(password.length<6||password.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if( myReg.test(password)){
      msg.push('不能使用特殊字符');
    }
    if(_(msg).size()>0){
      $error.removeClass('hidden').html(msg.join(','));
      //$error.css('display','block').html(msg.join(','));
      return false;
    }else{
      $error.addClass('hidden').html('');
      //$error.css('display','none').html('');
      return true;
    }
  }

  submitLoginPwd () {
    var msg = [];
    var self = this;
    var $errorc = $('.loginPwdConfirm-error');
    var password = $('input[name="loginPwd"]').val();
    var password2 = $('input[name="loginPwdConfirm"]').val();
    if (this.validateLoginPwd()) {
      if(password && password!=='' && password2!==''){
        if(password !== password2){
          msg.push('两次输入的密码不一致');
        }
        if(_(msg).size()>0){
          $errorc.removeClass('hidden').html(msg.join(','));
          //$errorc.css('display','block').html(msg.join(','));
        }else{
          $errorc.addClass('hidden').html('');
          //$errorc.css('display','none').html('');
          ajax({
            url: '/acct/userinfo/resetloginpwd.json',
            data: {
              username: this.$username.val(),
              loginPwd: password,
              loginToken: this.$loginToken.val()
            }
          }, res => {
            window.Alert({
              type: 'confirm',
              title: '',
              content: '登录密码修改成功，请重新登录。',
              noCancel: true,
              callback: () => {
                self.props.pushState('/login');
              }
            });

          }, err => {
            window.Alert({
              type: 'confirm',
              title: '',
              content: err.msg,
              noCancel: true
            });
          });
        }
      }
    }
    return false;
  }

  contactService() {
    window.open('http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370','service');
  }

}
module.exports = ResetPassword
