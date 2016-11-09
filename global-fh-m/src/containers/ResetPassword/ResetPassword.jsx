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
    let url =  window.self.location.toString();
    this.codeImgUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code?q=' + window.keyGenerator();
    //this.codeImgUrl = 'http://forehead.highborn.cn/acct/imgcode/code?q=' + window.keyGenerator();
    //this.myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
    this.myReg = /\s+/;
    this.username = '';
    this.loginToken = '';
    this.code = '';
    this.findWay = true;
    this.state = {

    }
  }

  componentDidMount () {
    this.loaded()
  }

  render () {

    return (
      <div className="login-container setpsd-con">
        <div className="login-logo paddingtop"><img src={require("images/fh-logo.png")} width="38%" /></div>
        <div className="resetpwd-title-bar padding-h-sm">
          <div className="resetpwd-title reset-tt1 ">1.验证用户名 </div>
          <div className="resetpwd-title reset-tt2 hidden">2.选择密码找回方式</div>
          <div className="resetpwd-title reset-tt3 hidden">3.重置密码</div>
          <div className="resetpwd-title reset-tt4 hidden">4.重置密码完成</div>
        </div>
        {
          <div>
            <div className="panel1 ">
              <div className="login-row">
                <input ref="userName" className="ui-input" type="text" name="username" placeholder="输入用户名"/>
              </div>
              <div className="login-row">
                <input ref="code" className="ui-input input-wd-hf" type="text" name="inputAccount" placeholder="输入验证码" />
                <img ref="codeImg" className="validCode" src={this.codeImgUrl} alt="验证码图片" onClick={::this.refreshCodeImg} />
              </div>
              <div className="err error-message-container"></div>
              <div className="login-row row-btn-psd">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red-fh waves-light btn-large'
                }} onClick={::this.verifyUsername} />
              </div>
              <div className="fogotpsd-tip">
                <Button config={{
                  text: '返回登录页',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goToLogin} />
              </div>
            </div>
            <div className="panel2 hidden">
              <div className="step2-chocie padding-h-sm">
                <div className="step2-tt st2-tt1 cur" onClick={::this.chagefindway}><div>通过“密保问题”找回</div></div>
                <div className="step2-tt-arr">OR</div>
                <div className="step2-tt step2-tt-mg0 st2-tt2" onClick={::this.chagefindway2}><div>通过“资金密码”找回</div></div>
              </div>
              <div className="">
                <div className="step2 usepsdproqes ">
                  <div className="preoqescon">
                    <div>
                      <div className="login-row">
                        <div className="step2-q-num">问题一</div>
                        <select className="ui-input getqes_sel" onChange={::this.onQuestionChange} id="_firstQes" ><option>eeeeeee</option></select>
                      </div>
                      <div className="login-row ">
                        <div className="step2-q-num">答案一</div>
                        <input ref="userName" className="ui-input" type="text" name="username"  id="_firstAnswer" />
                      </div>
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div>
                      <div className="login-row">
                        <div className="step2-q-num">问题二</div>
                        <select className="ui-input getqes_sel" onChange={::this.onQuestionChange} id="_secondQes" ></select>
                      </div>
                      <div className="login-row">
                        <div className="step2-q-num">答案二</div>
                        <input ref="userName" className="ui-input" type="text" name="username"  id="_secondAnswer" />
                      </div>
                    </div>
                  </div>
                  <div className="err error-message-container"></div>
                  <div className="cantUseMsg">未设置密保问题-不可使用</div>
                </div>
                <div className="step2 usefundpsd hidden">
                  <div className="fundpsdcon">
                    <div className="login-row"><input ref="fundPassword" className="ui-input" type="password" name="fundPassword" /></div>
                    <div className="err error-message-container"></div>
                  </div>
                  <div className="cantUseMsg">未设置资金密码-不可使用</div>
                </div>
              </div>
              <div className="login-row"><a className="contact-service" href="javascript:void(0);" onClick={::this.contactService}>以上均不可用？联系客服</a></div>
              <div className="login-row row-btn-psd">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red-fh waves-light btn-large'
                }} onClick={::this.verifyAnswer} />
              </div>
              <div className="fogotpsd-tip">
                <Button config={{
                  text: '上一步',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goBackStep1} />
                <br/>
                <Button config={{
                  text: '返回登录页',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goToLogin} />
              </div>
            </div>
            <div className="panel3 hidden">
              <div className="login-row"><input ref="password" className="ui-input" type="password" name="inputPwd" placeholder="新登录密码" onBlur={::this.validateLoginPwd} /></div>
              <div className="err err-psd"><div className="error-message-container"></div></div>
              <div className="login-row"><input ref="password2" className="ui-input" type="password" name="inputPwd2" placeholder="确认登录密码" onBlur={::this.validateLoginPwd2} /></div>
              <div className="err err-psd2"><div className="error-message-container"></div></div>
              <div className="login-row row-btn-psd">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red-fh waves-light btn-large'
                }} onClick={::this.setNewPwd} />
              </div>
              <div className="fogotpsd-tip">
                <Button config={{
                  text: '上一步',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goBackStep2} />
                <br/>
                <Button config={{
                  text: '返回登录页',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goToLogin} />
              </div>
            </div>
            <div className="panel4 hidden">
              <p className="setSuc">恭喜你！设置成功！</p>
              <div className="login-row">
                <Button
                  config={{
                  text: '登录平台',
                  className: 'btn-red-fh waves-light btn-large'
                }} onClick={::this.goToLogin} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }

  goBackStep1 () {
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt1').removeClass('hidden');
    $('.panel2').addClass('hidden');
    $('.panel1').removeClass('hidden');
  }
  goBackStep2 () {
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt2').removeClass('hidden');
    $('.panel3').addClass('hidden');
    $('.panel2').removeClass('hidden');
  }
  goStep3 () {
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt3').removeClass('hidden');
    $('.panel2').addClass('hidden');
    $('.panel3').removeClass('hidden');
  }
  goStep4 () {
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt4').removeClass('hidden');
    $('.panel3').addClass('hidden');
    $('.panel4').removeClass('hidden');
  }
  goToLogin () {
    let self = this;
    window.setTimeout(function () {
      self.props.pushState('/login');
    }, 600);
  }
  contactService() {
    window.open(_.getCustomerServiceUrl(),'service');
  }

  refreshCodeImg () {
    this.refs.codeImg.src = `${this.codeImgUrl}?p=${Math.random().toString(36)}`
    $('input[name="inputAccount"]').val('')
  }

  //判断用户名
  verifyUsername () {
    var username = $('input[name="username"]').val().trim()
    if(username){
      ajax({
        url: '/acct/login/verifyusername.json',
        data: {
          username: $('input[name="username"]').val().trim(),
          verifyCode: this.refs.code.value.trim()
        }
      }, resp => {
        $('.panel1').find('.error-message-container').html('')
        $('.panel1').find('.error-message-container').hide();
        this.username = $('input[name="username"]').val().trim();
        this.loginToken = resp.root.pwdToken
        $('.resetpwd-title').addClass('hidden');
        $('.reset-tt2').removeClass('hidden');
        $('.panel1').addClass('hidden');
        $('.panel2').removeClass('hidden');
        if(resp.root.payPwdStatus==0){
          $('.fundpsdcon').hide();
          $('.usefundpsd').find('.cantUseMsg').show();
        }else{
          $('.fundpsdcon').show();
          $('.usefundpsd').find('.cantUseMsg').hide();
        }
        if(resp.root.qesStatus==1){
          $('.preoqescon').hide();
          $('.usepsdproqes').find('.cantUseMsg').show();
        }else{
          $('.preoqescon').show();
          $('.usepsdproqes').find('.cantUseMsg').hide();
          this.getSQs();
        }
      }, err => {
        this.refreshCodeImg ();
        $('.panel1').find('.error-message-container').html(err.msg || '用户名验证失败')
        $('.panel1').find('.error-message-container').show();
      })
    }else{
      $('.panel1').find('.error-message-container').html('请输入用户名和验证码')
      $('.panel1').find('.error-message-container').show();
    }
  }
  chagefindway () {
    $('.st2-tt2').removeClass('cur');
    $('.st2-tt1').addClass('cur');
    $('.usefundpsd').addClass('hidden');
    $('.usepsdproqes').removeClass('hidden');
    this.findWay = true;
  }
  chagefindway2 () {
    $('.st2-tt1').removeClass('cur');
    $('.st2-tt2').addClass('cur');
    $('.usepsdproqes').addClass('hidden');
    $('.usefundpsd').removeClass('hidden');
    this.findWay = false;
  }


  getSQs () {
    ajax({
      url: 'acct/usersecurity/getqesforloginpwd.json',
      data:{
        username: this.username,
        loginToken: this.loginToken
      }
    }, resp => {
      //成功后,将问题列表加载在下拉框中
        $('.getqes_sel').html('<option value="">请选择密保问题</option>');
        $('.getqes_sel').append(_(resp.root).map(function (option) {
          return '<option value="' + option.qesId + '">' + option.question + '</option>';
        }).join(''));
        $('#_firstAnswer').val('');
        $('#_secondAnswer').val('');
    }, err => {
      window.Alert({
        content: err.msg || '请求失败！'
      });
    })
  }

  onQuestionChange (e) {
    var $target = $(e.currentTarget);
    var $option = $target.find('option:selected');

    var selectedValue = $option.siblings('.selected').removeClass('selected').val();
    var selectingValue = $target.val();

    $('.getqes_sel').not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
    $('.getqes_sel').not($target).find('option[value=' + selectingValue + ']').addClass('hidden');

    $option.addClass('selected');
  }
  verifyQustions () {
    ajax({
      url: '/acct/usersecurity/verqesforloginpwd.json',
      data: {
        'secrityList[0].securityId': $('#_firstQes').find("option:selected").val(),
        'secrityList[0].securityQes':$('#_firstQes').find("option:selected").text(),
        'secrityList[0].securityAsw': $('#_firstAnswer').val(),
        'secrityList[1].securityId': $('#_secondQes').find("option:selected").val(),
        'secrityList[1].securityQes': $('#_secondQes').find("option:selected").text(),
        'secrityList[1].securityAsw': $('#_secondAnswer').val(),
        'username': this.username,
        'loginToken': this.loginToken
      }
    }, resp => {
      $(".usepsdproqes").find('.error-message-container').html('');
      $(".usepsdproqes").find('.error-message-container').hide();
      this.goStep3();
    }, err => {
     if(err.root!=null&&_(err.root).isNumber()) {
      if(err.root>0){
        $(".usepsdproqes").find('.error-message-container').html('验证失败,剩余' + err.root + '次机会。');
      }else{
        $(".usepsdproqes").find('.error-message-container').html('验证失败,请一个小时后再验证！');
      }
     }else{
      $(".usepsdproqes").find('.error-message-container').html('验证失败,' + err.msg);
     }
     $(".usepsdproqes").find('.error-message-container').show();
    })
  }

  verifyAnswer () {
    if(this.findWay){
      this.verifyQustions();
    }else{
      this.verifyCP();
    }
  }

  verifyCP () {
    ajax({
      url: '/fund/moneypd/verpwdforloginpwd.json',
      data:{
        payPwd: $('input[name="fundPassword"]').val().trim(),
        username: this.username,
        loginToken: this.loginToken
      }
    }, resp => {
      $(".usefundpsd").find('.error-message-container').html('');
      $(".usefundpsd").find('.error-message-container').hide();
      this.goStep3();
    }, err => {
      if(err.root!=null&&_(err.root).isNumber()) {
      if(err.root>0){
        $(".usefundpsd").find('.error-message-container').html('验证失败,剩余' + err.root + '次机会。');
      }else{
        $(".usefundpsd").find('.error-message-container').html('验证失败,请一个小时后再验证！');
      }
     }else{
      $(".usefundpsd").find('.error-message-container').html('验证失败,' + err.msg);
     }
     $(".usefundpsd").find('.error-message-container').show();
    })
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
  setNewPwd () {
    var validateLoginPwd = this.validateLoginPwd()
    var validateLoginPwd2 = this.validateLoginPwd2()
    if(validateLoginPwd && validateLoginPwd2){
      ajax({
        url: '/acct/userinfo/resetloginpwd.json',
        data:{
          loginPwd: $('input[name="inputPwd"]').val().trim(),
          username: this.username,
          loginToken: this.loginToken
        }
      }, resp => {
        this.goStep4();
      }, err => {
        window.Alert({
          content: err.msg || '请求失败！'
        });
      })
    }
  }

}
module.exports = ResetPassword
