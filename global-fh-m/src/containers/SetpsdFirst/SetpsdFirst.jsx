import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './SetpsdFirst.css'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux';
import Button from 'components/Button'
import MD5 from 'md5'
import SHA512 from 'sha512'
import config from 'config'

@WithStyles(styles)
@connect(state => ({

}), {
  pushState: routerActions.push
})
class SetpsdFirst extends Page {

  constructor () {
    super()

    //this.myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
    this.myReg = /\s+/;

  }

  componentDidMount () {
    this.loaded()
  }

  render () {

    return (
      <div className="login-container setpsd-con">
        <div className="panel paddingtop">
          <div className="login-logo"><img src="/images/fh-logo.png" width="38%" /></div>
          <div className="login-row"><p className="setpsd-tit">修改个人资料</p></div>
          <div className="login-row"><input ref="userName" className="ui-input" type="text" name="username" defaultValue={_.getQuery('userName')} readOnly /></div>
          <div className="err err-usename"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="userNameNick" className="ui-input" type="text" name="usernameNick" placeholder="昵称" onBlur={::this.checkUserNickExit} /></div>
          <div className="err err-usenameNick"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="password" className="ui-input" type="password" name="inputPwdOld" placeholder="旧登录密码" onBlur={::this.validateLoginPwdOld} /></div>
          <div className="err err-psd"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="password" className="ui-input" type="password" name="inputPwd" placeholder="新登录密码" onBlur={::this.validateLoginPwd} /></div>
          <div className="err err-psd1"><div className="error-message-container"></div></div>
          <div className="login-row"><input ref="password2" className="ui-input" type="password" name="inputPwd2" placeholder="确认登录密码" onBlur={::this.validateLoginPwd2} /></div>
          <div className="err err-psd2"><div className="error-message-container"></div></div>
          <div className="login-row-btn">
            <Button
              config={{
                text: '登录',
                className: 'btn-red-fh waves-light btn-large-m'
              }} onClick={::this.request} />
          </div>
        </div>
      </div>
    )
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
   //登录密码判断old
  validateLoginPwdOld () {
    var passwordOld = $('input[name="inputPwdOld"]').val();
    var password = $('input[name="inputPwd"]').val();
    var msg =[];
    if(passwordOld.length<6 || passwordOld.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if( this.myReg.test(passwordOld)){
      msg.push('不能使用空白符');
    }
    if(password && password!=='' && passwordOld!==''){
      if(password == passwordOld){
        msg.push('新旧密码不能一致');
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
  validateLoginPwd () {
    var passwordOld = $('input[name="inputPwdOld"]').val();
    var password = $('input[name="inputPwd"]').val();
    var password2 = $('input[name="inputPwd2"]').val();
    var msg =[];
    if(password.length<6 || password.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if (/(^\d{1,8})$/.test(password)){
      msg.push('密码不能使用9位以下纯数字')
    }
    if(passwordOld && passwordOld!=='' && password!==''){
      if(password == passwordOld){
        msg.push('新旧密码不能一致');
      }
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
      $('.err-psd1').find('.error-message-container').html(msg.join(','))
      $('.err-psd1').show();
      return false;
    }else{
      $('.err-psd1').find('.error-message-container').html('')
      $('.err-psd1').hide();
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

  doSubmit () {
    ajax({
      url: '/acct/userinfo/updateloginpwd.json',
      data: {
        uName: $('input[name="usernameNick"]').val(),
        oldPwd: $('input[name="inputPwdOld"]').val(),
        newPwd: $('input[name="inputPwd"]').val()
      }
    }, resp => {
      window.location.href = "/"
    }, err => {
      window.Alert({
        content: err.msg || '登录失败！'
      });
    })
  }

  request () {
    this.checkUserNickExit(() => {
      var validateLoginPwd = this.validateLoginPwd()
      var validateLoginPwd2 = this.validateLoginPwd2()
      if(validateLoginPwd && validateLoginPwd2){
        this.doSubmit()
      }
    })
  }

}
module.exports = SetpsdFirst
