import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Login.css'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux';
import * as loginActions from 'redux/modules/auth'
import Button from 'components/Button'
import MD5 from 'md5'
import SHA512 from 'sha512'
import Toggles from 'components/Toggles'
import { cookie } from 'storeUtil'

import logoPng from 'images/fh-logo.png'

@WithStyles(styles)
@connect(state => ({
  user: state.auth.user,
  loginError: state.auth.loginError
}), {
  ...loginActions,
  pushState: routerActions.push
})
class Login extends Page {

  constructor () {
    super()
  }

  getCodeImg () {
    let url =  window.self.location.toString();
    return  url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code?q=' + window.keyGenerator();
  }

  componentDidMount () {
    this.loaded()
  }

  componentWillReceiveProps (nextPorps) {

    if (nextPorps.user && nextPorps.user.token) {
      var a = nextPorps.user.userStatus
      if($('input[name="remember"]').prop('checked')){
        cookie.setCookie('userName', this.refs.userName.value.trim());
        cookie.setCookie('password', this.refs.password.value.trim());
        cookie.setCookie('remember', 'true');
      }else{
        cookie.setCookie('userName', '');
        cookie.setCookie('password', '');
        cookie.setCookie('remember', 'false');
      }
      if(103 == a || 104 == a || 105 == a || 106 == a){
        var r = "userName=" + nextPorps.user.username + "&status=" + a;
        this.props.pushState('/setpsd?' + encodeURI(r))
      }else if(0 == a || 100 == a || 102 == a){
        this.props.pushState('/')
      }else if(101 == a){
        window.Alert({
          content: '完全冻结的用户无法登录'
        });
      }
    }
  }

  render () {
    let error = this.props.loginError
    error && this.loaded()
    let userName = cookie.getCookie('userName') ? cookie.getCookie('userName') : '';
    let password = cookie.getCookie('password') ? cookie.getCookie('password') : '';
    let remember = cookie.getCookie('remember')==='true'? true : false ;
    return (
      <div className="login-container">
        <div className="panel paddingtop">
          <div className="login-logo"><img src={logoPng} width="38%" /></div>
          <div className="login-row input-row row-user"><input ref="userName" className="ui-input" type="text" defaultValue={userName}  name="inputAccount" placeholder="请输入用户名" onFocus={::this.clearErrCon} /></div>
          <div className="login-row input-row row-psd"><input ref="password" className="ui-input" type="password"  defaultValue={password} name="inputPwd" placeholder="请输入登录密码" onFocus={::this.clearErrCon} /></div>
          {
            error && error.root === 'invalid code' && <div className="login-row input-row row-code">
              <input ref="code" className="ui-input input-wd-hf" type="text" name="inputValid" placeholder="请输入验证码" />
              <img ref="codeImg" className="validCode" src={this.getCodeImg()} alt="验证码图片" onClick={::this.refreshCodeImg} />
            </div>
          }
          {error && <div className="error-message-container">{error.msg || '登录失败'}</div>}
          <div className="login-row">
            <Toggles
              config={{
                type: 'checkbox',
                text: '记住账号',
                name: 'remember',
                checked: remember,
              }}

              onClick={::this.rememberAcc}/>
            <Button config={{
              text: '忘记密码',
              className: 'btn-flat forgotpsd'
            }} onClick={::this.goToResetPassword} />
          </div>
          <div className="login-row-btn">
            <Button
              config={{
                text: '登 录',
                className: 'btn-red-fh waves-light btn-login'
              }} onClick={::this.login} />
          </div>
        </div>
        {<div className="fogotpsd-tip">
                  <Button config={{
                    text: '联系客服',
                    className: 'btn-flat waves-light btn-middle'
                  }} onClick={::this.contactService} />
                </div>}
        <div className="copyright">
          <p>繁华世界  版本:  1.0.0</p>
          <p>copyright © 2016 繁华世界 All rights reserved</p>
        </div>
      </div>
    )
  }

  rememberAcc () {

  }

  login () {
    let param = SHA512.hex_sha512(new Date().valueOf() + '')
    let data = {
      token: '',
      username: this.refs.userName.value.trim(),
      loginPwd: SHA512.hex_sha512(MD5.hex_md5(this.refs.password.value.trim() + '') + '' + param),
      param: param,
      code: this.refs.code?this.refs.code.value.trim():''
    }

    if (this.refs.code) {
      ajax({
        url: '/acct/imgcode/val.json',
        data: {
          code: this.refs.code.value.trim()
        }
      }, () => {
        this.props.login(data)
      }, () => {
       /* window.Alert({
          content: '验证码输入有误'
        });*/
        this.refreshCodeImg ()
      })
    } else {
      this.loading('正在登录中...')
      this.props.login(data)
    }
  }

  refreshCodeImg () {
    this.refs.codeImg.src = this.getCodeImg()
    $('input[name="inputValid"]').val('')
  }

  isMI(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/mi/i)=="mi") {
      return true;
    } else {
      return false;
    }
  }

  clearErrCon (e) {
    if(!this.isMI()){
      if (this.props.loginError) {
        console.log()
        e.target.value=''
      }
    }
  }

  goToResetPassword () {
    let self = this;
    window.setTimeout(function () {
      self.props.pushState('/resetPassword');
    }, 600);
  }

  contactService() {
     window.open('http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370','service');
  }


}
module.exports = Login
