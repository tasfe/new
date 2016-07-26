require('./resetPassword.scss');
require('./../misc/common-init.js');

var footer = require('../../components/footer');

var Encryption =  require('com/encryption');

$.widget('gl.resetPassword', {

  template: require('./resetPassword.html'),

  _create: function () {

    this.element.html(_(this.template).template()());

    this.$valCode = this.element.find('.js-rp-valCode');
    this.$valImg = this.element.find('.js-rp-valImg');
    this.$valMoneyPasswd = this.element.find('.js-moneyPasswdInput');

    var url =  window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code';
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());

    this._bindEvent();

    this.panel01Verify();
  },

  _bindEvent: function () {
    var self = this;
    //绑定事件
    this._on({
      'click .js-rp-setLPBtn': 'setLPHandler',//设置登录密码
      'click .js-rp-verifyFPBtn': 'verifyFPHandler',//验证资金密码
      'click .js-emailFind-black': 'emailFindBlack',//从安全邮箱找回页返回
      'click .js-open-safetyEmail': 'openSafetyEmail',//打开安全邮箱页
      'click .js-panel02-black': 'blackToPanel01',//返回到板块1
      'click .js-open-moneyPasswdTips': 'openMoneyPasswdTips',//.打开资金密码窗口
      'click .js-close-moneyPasswdTips': 'closeMoneyPasswordTips',//关闭资金密码弹窗
      'click .js-rp-verifyUNBtn': 'verifyUNHandler', //校验用户名
      'click .js-rp-valImg': 'refreshValCodeHandler' //刷新验证码
    });
  },

  setLPHandler: function(){
    $('.panel03').addClass('hidden');
    $('.panel04').removeClass('hidden');

    $('.leftMenu-julien div b').removeClass('red');
    $('.leftMenu-julien div b').eq(3).addClass('red');
  },

  verifyFPHandler: function (e) {
    var self = this;

    if(this.$valMoneyPasswd.val().length < 6){
      $('.js-moneyPassord').addClass('wrong');
      $('.js-moneyPassord').removeClass('correct');

    }
    else{
      $('.js-moneyPasswdTips').addClass('hidden');
      $('.panel02').addClass('hidden');
      $('.panel03').removeClass('hidden');

      $('.leftMenu-julien div b').removeClass('red');
      $('.leftMenu-julien div b').eq(2).addClass('red');
    }
  },

  emailFindBlack:function(){
    $('.panel02').removeClass('hidden');
    $('.emailFind').addClass('hidden');
  },

  openSafetyEmail:function(){
    $('.panel02').addClass('hidden');
    $('.emailFind').removeClass('hidden');

    var emailTime = setInterval(function(){
      var num = $('.js-emailTime').html() - 1;

      if ($('.js-emailTime').html() == 0) {
        clearInterval(emailTime)
      }
      else{
        $('.js-emailTime').html(num);
      }
    }, 1000)
  },

  blackToPanel01:function(){
    $('.panel02').addClass('hidden');
    $('.panel01').removeClass('hidden');

    $('.leftMenu-julien div b').removeClass('red');
    $('.leftMenu-julien div b').eq(0).addClass('red');
  },

  openMoneyPasswdTips:function(){
    $('.js-moneyPasswdTips').removeClass('hidden');
  },

  closeMoneyPasswordTips: function(){
    this.$valMoneyPasswd.val('');
    $('.js-moneyPasswdTips').addClass('hidden');
  },

  //julien的验证代码
  panel01Verify: function() {
    $('#jsRPUserName').on('input', function() { 
      if ($('#jsRPUserName').val().length < 1) {
        $('.js-userName').addClass('wrong');
        $('.js-userName').removeClass('correct');
      }
      else{
        $('.js-userName').removeClass('wrong');
        $('.js-userName').addClass('correct');
      }
    });
  },

  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCode.val('');
  },

  verifyUNHandler: function(){
    var iIs = 0;

    if ($('#jsRPUserName').val().length < 1) {
      $('.js-userName').addClass('wrong');
      $('.js-userName').removeClass('correct');

      iIs = 1;
    }

    if (this.$valCode.val().length != 4) {
      $('.code').addClass('wrong');
      $('.code').removeClass('correct');

      iIs = 1;
    }

    if(iIs == 0){
      $('.leftMenu-julien div b').removeClass('red');
      $('.leftMenu-julien div b').eq(1).addClass('red');
      $('.panel01').addClass('hidden');
      $('.panel02').removeClass('hidden');
    }
  },

  //TODO Deferred 验证用户，用户名和验证码,待修改参数名
  verifyUserNameXhr: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/login/verifyusername.json',
      data: {
        username: this.$username.val(),
        //=============================================================TODO
        verifyCode:this.$valCode.val()
        //=================================================
      }
    });
  },

  //TODO 验证资金密码 ，待修改参数名
  verifyFundPassword: function () {
    return $.ajax({
      type: 'POST',
      url: '/fund/moneypd/verpwdforloginpwd.json',
      data: {
        payPwd: this.element.find('.js-rp-fundPassword').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val()
      }
    });
  }
});

$(document).ready(function() {
  //$('.js-package').before(_(header).template()({})).after(footer);
  $('.js-package').resetPassword();
});
