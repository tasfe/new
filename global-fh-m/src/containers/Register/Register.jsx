import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Register.css'
import Button from 'components/Button'
import config from 'config'
import { cookie } from 'storeUtil'

@WithStyles(styles)
class Register extends Page {

  constructor () {
    super()
    let url =  window.self.location.toString();
    this.codeImgUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code?q=' + window.keyGenerator();
    //this.codeImgUrl = 'http://forehead.highborn.cn/acct/imgcode/code?q=' + window.keyGenerator();
    //this.myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
    this.myReg = /\s+/;
  }

  componentDidMount () {
    this.loaded()
    this.linkId = _.getQuery('linkId')
  }

  render () {

    return (
      <div className="login-container setpsd-con">
        <div className="panel paddingtop">
          <div className="login-logo"><img src={require("images/fh-logo.png")} width="38%" /></div>
          <div className="login-row"><p className="setpsd-tit">注册会员</p></div>
          <div className="login-row"><input ref="userName" className="ui-input" type="text" name="username" placeholder="请输入您的账号" onBlur={::this.checkUserExit} /></div>
          <div className="err err-usename"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="userNameNick" className="ui-input" type="text" name="usernameNick" placeholder="请输入您的昵称" onBlur={::this.checkUserNickExit} /></div>
          <div className="err err-usenameNick"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="password" className="ui-input" type="password" name="inputPwd" placeholder="请输入您的密码" onBlur={::this.validateLoginPwd} /></div>
          <div className="err err-psd"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="password2" className="ui-input" type="password" name="inputPwd2" placeholder="请再次输入您的密码" onBlur={::this.validateLoginPwd2} /></div>
          <div className="err err-psd2"><div className="error-message-container"></div></div>
          <div className="login-row">
            <input ref="code" className="ui-input input-wd-hf" type="text" name="inputAccount" placeholder="请输入验证码" onBlur={::this.codeImg} />
            <img ref="codeImg" className="validCode" src={this.codeImgUrl} alt="验证码图片" onClick={::this.refreshCodeImg} />
          </div>
          <div className="err err-code"><div className="error-message-container"></div></div>
          <div className="login-row-btn">
            <Button
              config={{
                text: '注册',
                className: 'btn-red-fh waves-light btn-large-m'
              }} onClick={::this.request} />
          </div>
        </div>
      </div>
    )
  }

  refreshCodeImg () {
    this.refs.codeImg.src = `${this.codeImgUrl}?p=${Math.random().toString(36)}`
    $('input[name="inputAccount"]').val('')
  }

  //判断用户名
  checkUserExit (callback) {
    var username = $('input[name="username"]').val().trim()
    if(username){
      ajax({
        url: '/acct/reg/userexist.json',
        data: {
          username: $('input[name="username"]').val().trim()
        }
      }, resp => {
        $('.err-usename').find('.error-message-container').html('')
        $('.err-usename').hide();
        callback && 'function' === typeof callback && callback()
      }, err => {
        $('.err-usename').find('.error-message-container').html(err.msg || '用户名错误')
        $('.err-usename').show();
         return false
      })
    }else{
      $('.err-usename').find('.error-message-container').html('请输入用户名')
      $('.err-usename').show();
    }
  }

  //判断用户昵称
  checkUserNickExit (callback) {
    var username = $('input[name="usernameNick"]').val().trim()
    if(username){
      ajax({
        url: '/acct/reg/checkuname.json',
        data: {
          uname: $('input[name="usernameNick"]').val().trim()
        }
      }, resp => {
        $('.err-usenameNick').find('.error-message-container').html('')
        $('.err-usenameNick').hide();
        callback && 'function' === typeof callback && callback()
      }, err => {
        $('.err-usenameNick').find('.error-message-container').html(err.msg || '用户名错误')
        $('.err-usenameNick').show();
         return false
      })
    }else{
      $('.err-usenameNick').find('.error-message-container').html('请输入用户名')
      $('.err-usenameNick').show();
    }
  }

  //登录密码判断
  validateLoginPwd () {

    var password = $('input[name="inputPwd"]').val();
    var password2 = $('input[name="inputPwd2"]').val();
    var msg =[];
    if(password.length<6 || password.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if (/(^\d{1,8})$/.test(password)){
      msg.push('密码不能使用9位以下纯数字')
    }
    if( this.myReg.test(password)){
      msg.push( '不能使用空白符');
    }
    if(password2 && password2!=='' && password!==''){
      if(password !== password2){
        msg.push('两次输入的密码不一致');
      }
    }
    if(msg.length>0){
      $('.err-psd').find('.error-message-container').html(msg.join(','))
      $('.err-psd').show();
      return false;
    }else{
      $('.err-psd').find('.error-message-container').html('')
      $('.err-psd').hide();
      return true;
    }
  }
  //登录密码判断
  validateLoginPwd2 () {
    var password = $('input[name="inputPwd"]').val();
    var password2 = $('input[name="inputPwd2"]').val();
    var msg =[];
    if(password2.length<6 || password2.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if (/(^\d{1,8})$/.test(password2)){
      msg.push('密码不能使用9位以下纯数字')
    }
    if( this.myReg.test(password2)){
      msg.push( '不能使用空白符');
    }
    if(password && password!=='' && password2!==''){
      if(password !== password2){
        msg.push('两次输入的密码不一致');
      }
    }
    if(msg.length>0){
      $('.err-psd2').find('.error-message-container').html(msg.join(','))
      $('.err-psd2').show();
      return false;
    }else{
      $('.err-psd2').find('.error-message-container').html('')
      $('.err-psd2').hide();
      return true;
    }
  }

  codeImg () {
    if(this.refs.code.value==''){
      $('.err-code').find('.error-message-container').html('请输入验证码')
      $('.err-code').show();
      return false
    }else{
      $('.err-code').find('.error-message-container').html('')
      $('.err-code').hide();
      return true
    }
  }

  doReg (callback) {
    ajax({
      url: '/acct/reg/doreg.json',
      data: {
        userName: $('input[name="username"]').val().trim(),
        userUname: $('input[name="usernameNick"]').val().trim(),
        loginPwd: $('input[name="inputPwd"]').val(),
        linkId: this.linkId
      }
    }, resp => {
      cookie.setCookie('user_token', resp.root.token);
      window.location.href = "/index.html"
    }, err => {
      window.Alert({
        content: err.msg || '注册失败！'
      });
    })
  }

  register (callback) {
    ajax({
      url: '/acct/imgcode/val.json',
      data: {
        code: this.refs.code.value.trim()
      }
    }, resp => {
      $('.err-code').find('.error-message-container').html('')
      $('.err-code').hide();
      callback && callback()
    }, err => {
      var e = '验证码错误'
      if(err.msg == 'fail'){
        e = '验证码错误'
      }else{
        e = err.msg
      }
      $('.err-code').find('.error-message-container').html(e)
      $('.err-code').show();
      $('input[name="inputAccount"]').val('')
      this.refreshCodeImg ()
      return false
    })
  }

  request () {
    this.checkUserExit(() => {
      this.checkUserNickExit(() => {
        var validateLoginPwd = this.validateLoginPwd()
        var validateLoginPwd2 = this.validateLoginPwd2()
        var codeImg = this.codeImg()
        if(validateLoginPwd && validateLoginPwd2 && codeImg){
          this.register(() => {
            this.doReg()
          })
        }
      })
    })
  }

}
module.exports = Register
