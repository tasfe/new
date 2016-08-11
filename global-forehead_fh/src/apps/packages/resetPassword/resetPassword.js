require('./resetPassword.scss');
require('./../misc/common-init.js');

var footer = require('../../components/footer');

var Encryption =  require('com/encryption');

$.widget('gl.resetPassword', {

  template: require('./resetPassword.html'),

  _create: function () {

    this.element.html(_(this.template).template()());

    this.$username = this.element.find('.js-rp-userName');
    this.$valCode = this.element.find('.js-rp-valCode');
    this.$valImg = this.element.find('.js-rp-valImg');
    this.$valMoneyPasswd = this.element.find('.js-moneyPasswdInput');

    var url =  window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code';
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());

    this._bindEvent();

    this.panel01Verify();
    this.safetyTipsBind();
    this.verifyQesBind();
  },

  _bindEvent: function () {
    var self = this;
    //绑定事件
    this._on({
      'click .js-set-success': 'setSuccess',//设置成功
      'click .js-reSendEmail': 'reSendEmail',//重新发送邮件
      'click .js-rp-verifySQABtn': 'verifySQABtn',//安全问题验证
      'click .js-rp-findBySQBtn': 'findBySQBtn',//进入安全问题
      'click .js-safety-problem-black': 'safetyProblemBlack',//安全问题返回
      'click .js-rp-setLPBtn': 'setLPHandler',//设置登录密码
      'click .js-reset': 'reset',//清空登录密码
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

  setSuccess: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');

    $target.button('loading');
    this.getEmail().fail(function () {
      Global.ui.notification.show('网络异常');
    })
    .always(function() {
      $target.button('reset');
    })
    .done(function (res) {
      $('.js-emailSendLoading').addClass('hidden');
      if (res && res.result === 0) {
        if (res.root.success) {
          sessionStorage.setItem('update', 'ok');
          $('.emailFind').addClass('hidden');
          $('.panel03').removeClass('hidden');

          $('.leftMenu-julien div b').removeClass('red');
          $('.leftMenu-julien div b').eq(2).addClass('red');
        }
        else{
          Global.ui.notification.show('没有验证成功');
        }
      } else {
        Global.ui.notification.show(res.msg);
      }
    });
  },

  reSendEmail: function(){
    $('.js-emailSendLoading').removeClass('hidden');

    if($('.js-emailTime').html() == 0){
      this.sendEmail().fail(function () {
        $('.js-emailSendLoading').addClass('hidden');
        Global.ui.notification.show('邮件发送失败，网络异常');
      }).done(function (res) {
        $('.js-emailSendLoading').addClass('hidden');
        if (res && res.result === 0) {
          Global.ui.notification.show('邮件已发送');
          $('.js-emailTime').html(50);
          var emailTime = setInterval(function(){
            var num = $('.js-emailTime').html() - 1;
            if ($('.js-emailTime').html() == 0) {
              clearInterval(emailTime)
            }
            else{
              $('.js-emailTime').html(num);
            }
          }, 1000)
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
    }
    else{
      Global.ui.notification.show('邮件已发送' + $('.js-emailTime').html() + '秒后才能再次发送邮件');
    }
  },

  verifyQesBind: function(){
    var verifyQesBind1 = _(function() {
      var str1= $('.js-answer1').val();
      if (str1.length == 0) {
        $('.js-safety-problem dl').eq(1).addClass('wrong');
        $('.js-safety-problem dl').eq(1).removeClass('correct');
      }
      else{
        $('.js-safety-problem dl').eq(1).addClass('correct');
        $('.js-safety-problem dl').eq(1).removeClass('wrong');
      }
    }).debounce(400);

    var verifyQesBind2 = _(function() {
      var str1= $('.js-answer1').val();
      if (str1.length == 0) {
        $('.js-safety-problem dl').eq(3).addClass('wrong');
        $('.js-safety-problem dl').eq(3).removeClass('correct');
      }
      else{
        $('.js-safety-problem dl').eq(3).addClass('correct');
        $('.js-safety-problem dl').eq(3).removeClass('wrong');
      }
    }).debounce(400);

    var verifyQesBind3 = _(function() {
      var str1= $('.js-answer1').val();
      if (str1.length == 0) {
        $('.js-safety-problem dl').eq(5).addClass('wrong');
        $('.js-safety-problem dl').eq(5).removeClass('correct');
      }
      else{
        $('.js-safety-problem dl').eq(5).addClass('correct');
        $('.js-safety-problem dl').eq(5).removeClass('wrong');
      }
    }).debounce(400);

    $('.js-answer1').on('keypress', verifyQesBind1);
    $('.js-answer2').on('keypress', verifyQesBind2);
    $('.js-answer3').on('keypress', verifyQesBind3);
  },

  verifySQABtn: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');

    var str1= $('.js-answer1').val();
    var str2= $('.js-answer2').val();
    var str3= $('.js-answer3').val();
    var iIs = 0;

    if (str1.length == 0) {
      $('.js-safety-problem dl').eq(1).addClass('wrong');
      $('.js-safety-problem dl').eq(1).removeClass('correct');

      iIs = 1;
    }
    else{
      $('.js-safety-problem dl').eq(1).addClass('correct');
      $('.js-safety-problem dl').eq(1).removeClass('wrong');
    }

    if (str2.length == 0) {
      $('.js-safety-problem dl').eq(3).addClass('wrong');
      $('.js-safety-problem dl').eq(3).removeClass('correct');

      iIs = 1;
    }
    else{
      $('.js-safety-problem dl').eq(3).addClass('correct');
      $('.js-safety-problem dl').eq(3).removeClass('wrong');
    }
    if (str3.length == 0) {
      $('.js-safety-problem dl').eq(5).addClass('wrong');
      $('.js-safety-problem dl').eq(5).removeClass('correct');
      iIs = 1;
    }
    else{
      $('.js-safety-problem dl').eq(5).addClass('correct');
      $('.js-safety-problem dl').eq(5).removeClass('wrong');
    }

    if (iIs == 0) {
      $target.button('loading');
      this.verifySecurityQuestion().always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('密保问题验证请求失败');
      }).done(function (res) {
        if (res && res.result === 0) {
          sessionStorage.setItem('update', 'ok');

          $('.js-safety-problem').addClass('hidden');
          $('.panel02').addClass('hidden');
          $('.panel03').removeClass('hidden');

          $('.leftMenu-julien div b').removeClass('red');
          $('.leftMenu-julien div b').eq(2).addClass('red');
        } else {
          if(res.root!=null&&_(res.root).isNumber()) {
            if(res.root>0){
              Global.ui.notification.show('验证失败,剩余' + res.root + '次机会。');
            }else{
              Global.ui.notification.show('验证失败,请一个小时后再验证！');
            }
          }else{
            Global.ui.notification.show('验证失败,' + res.msg);
          }
        }
      });
    }
  },

  findBySQBtn: function(){
    $('.js-safety-problem').removeClass('hidden');
    $('.panel02').addClass('hidden');

    this.getUserEcurityQes().fail(function () {
      $('.js-safety-problem').addClass('hidden');
      $('.panel02').removeClass('hidden');
      Global.ui.notification.show('获取密码问题失败');
    }).done(function (res) {
      if (res && res.result === 0) {
        $('.js-safety-problem dd').eq(0).html(res.root[0].userSecurityQuestion);
        $('.js-safety-problem dd').eq(2).html(res.root[1].userSecurityQuestion);
        $('.js-safety-problem dd').eq(4).html(res.root[2].userSecurityQuestion);

        $('.js-safety-problem dd').eq(0).attr('data-id',res.root[0].userSecurityId);
        $('.js-safety-problem dd').eq(2).attr('data-id',res.root[1].userSecurityId);
        $('.js-safety-problem dd').eq(4).attr('data-id',res.root[2].userSecurityId);
      } else {
        $('.js-safety-problem').addClass('hidden');
        $('.panel02').removeClass('hidden');
        Global.ui.notification.show(res.msg);
      }
    });
  },

  safetyProblemBlack: function(){
    $('.js-safety-problem').addClass('hidden');
    $('.panel02').removeClass('hidden');
  },

  reset: function () {
    $('.js-rp-loginPwd1').val('');
    $('.js-rp-loginPwd2').val('');
    $('.js-passwdSafetyTips').addClass('hidden');
    $('.panel03 dl').removeClass('correct');
    $('.panel03 dl').removeClass('wrong');
  },

  safetyTipsBind: function () {
    var newLoginPassword = _(function() {
      var str= $('.js-rp-loginPwd1').val();
      var str2= $('.js-rp-loginPwd2').val();

      if (str.length == 0) {
        $('.panel03 dl').eq(0).addClass('wrong');
        $('.panel03 dl').eq(0).removeClass('correct');
        $('.panel03 dl .messageBox span').eq(0).html('不能为空');
      }
      else if ( !isNaN(str) && str.length < 9 ) {
        $('.panel03 dl').eq(0).addClass('wrong');
        $('.panel03 dl').eq(0).removeClass('correct');
        $('.panel03 dl .messageBox span').eq(0).html('不能是9位以下的纯数字（≤8个阿拉伯数字）');
      }
      else if(str.indexOf(" ")>0){
        $('.panel03 dl').eq(0).addClass('wrong');
        $('.panel03 dl').eq(0).removeClass('correct');
        $('.panel03 dl .messageBox span').eq(0).html('不能包含空格');
      }
      else if (str.length < 6 || str.length > 20) {
        $('.panel03 dl').eq(0).addClass('wrong');
        $('.panel03 dl').eq(0).removeClass('correct');
        $('.panel03 dl .messageBox span').eq(0).html('6-20位字符组成');
      }
      else{
        $('.panel03 dl').eq(0).removeClass('wrong');
        $('.panel03 dl').eq(0).addClass('correct');
        $('.panel03 dl .messageBox span').eq(0).html('');
      }

      if (str2 != '') {
        if (str == str2) {
          $('.panel03 dl').eq(1).removeClass('wrong');
          $('.panel03 dl').eq(1).addClass('correct');
        }
        else{
          $('.panel03 dl').eq(1).addClass('wrong');
          $('.panel03 dl').eq(1).removeClass('correct');
        }
      }

      var num = 0;
      if ( str.length > 0 ) {
        if(/\d/gi.test(str)){
          num++;
        }

        if (/[A-Za-z]/.test(str)) {
          num++;
        }

        if(/[@#\$%\^&\*\!]+/g.test(str)){
          num++;
        }

        $('.js-passwdSafetyTips span').removeClass('s3').removeClass('s2').removeClass('s1');
        $('.js-passwdSafetyTips b').removeClass('s3').removeClass('s2').removeClass('s1');
        $('.js-passwdSafetyTips p').removeClass('s3').removeClass('s2').removeClass('s1');
        if (num == 3) {
          $('.js-passwdSafetyTips span').addClass('s3');
          $('.js-passwdSafetyTips p').addClass('s3');
          $('.js-passwdSafetyTips b').addClass('s3');
          $('.js-passwdSafetyTips b').html('强');
        }
        if (num == 2) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s2');
          $('.js-passwdSafetyTips p').addClass('s2');
          $('.js-passwdSafetyTips span').eq(1).addClass('s2');
          $('.js-passwdSafetyTips b').addClass('s2');
          $('.js-passwdSafetyTips b').html('中');
        }
        if (num == 1) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s1');
          $('.js-passwdSafetyTips p').addClass('s1');
          $('.js-passwdSafetyTips b').addClass('s1');
          $('.js-passwdSafetyTips b').html('弱');
        }

        num = 0;
        num = 0;
      }

      if (str.length != 0) {
        $('.passwdSafetyTips').removeClass('hide');
      }
      else{
        $('.passwdSafetyTips').addClass('hide');
      }

    }).debounce(400);

    var newLoginPassword2 = _(function() {
      var str= $('.js-rp-loginPwd1').val();
      var str2= $('.js-rp-loginPwd2').val();

      if (str != str2){
        $('.panel03 dl').eq(1).addClass('wrong');
        $('.panel03 dl').eq(1).removeClass('correct');
      }
      else{
        $('.panel03 dl').eq(1).removeClass('wrong');
        $('.panel03 dl').eq(1).addClass('correct');
      }
    }).debounce(400);

    $('.js-rp-loginPwd1').on('keypress', newLoginPassword);
    $('.js-rp-loginPwd2').on('keypress', newLoginPassword2);
  },

  setLPHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');

    var str= $('.js-rp-loginPwd1').val();
    var str2= $('.js-rp-loginPwd2').val();

    if (str.length == 0) {
      $('.panel03 dl').eq(0).addClass('wrong');
      $('.panel03 dl').eq(0).removeClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('不能为空');
    }
    else if ( !isNaN(str) && str.length < 9 ) {
      $('.panel03 dl').eq(0).addClass('wrong');
      $('.panel03 dl').eq(0).removeClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('不能是9位以下的纯数字（≤8个阿拉伯数字）');
    }
    else if(str.indexOf(" ")>0){
      $('.panel03 dl').eq(0).addClass('wrong');
      $('.panel03 dl').eq(0).removeClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('不能包含空格');
    }
    else if (str.length < 6 || str.length > 20) {
      $('.panel03 dl').eq(0).addClass('wrong');
      $('.panel03 dl').eq(0).removeClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('6-20位字符组成');
    }
    else if (str != str2){
      $('.panel03 dl').eq(0).removeClass('wrong');
      $('.panel03 dl').eq(0).addClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('');

      $('.panel03 dl').eq(1).addClass('wrong');
      $('.panel03 dl').eq(1).removeClass('correct');
    }
    else if (sessionStorage.getItem('update') != 'ok') {
      Global.ui.notification.show('安全报错');
    }
    else{
      $('.panel03 dl').eq(0).removeClass('wrong');
      $('.panel03 dl').eq(0).addClass('correct');
      $('.panel03 dl .messageBox span').eq(0).html('');

      $('.panel03 dl').eq(1).removeClass('wrong');
      $('.panel03 dl').eq(1).addClass('correct');

      $target.button('loading');
      this.resetLoginPwd().always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('设置登录密码请求失败');
      }).done(function (res) {
        if (res && res.result === 0) {
          $('.panel03').addClass('hidden');
          $('.panel04').removeClass('hidden');

          $('.leftMenu-julien div b').removeClass('red');
          $('.leftMenu-julien div b').eq(3).addClass('red');
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
    }
  },

  verifyFPHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');

    if(this.$valMoneyPasswd.val().length < 6){
      $('.js-moneyPassord').addClass('wrong');
      $('.js-moneyPassord').removeClass('correct');
    }
    else{
      $target.button('loading');

      this.verifyFundPassword().always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('资金密码验证请求失败');
      }).done(function (res) {
        if (res && res.result === 0) {
          sessionStorage.setItem('update', 'ok');

          $('.js-moneyPasswdTips').addClass('hidden');
          $('.panel02').addClass('hidden');
          $('.panel03').removeClass('hidden');

          $('.leftMenu-julien div b').removeClass('red');
          $('.leftMenu-julien div b').eq(2).addClass('red');
        } else {
          var errorInfo = '';
          if(res.root!=null&&_(res.root).isNumber()) {
            if(res.root>0){
              errorInfo = '验证失败,剩余' + res.root + '次机会。';
            }else{
              errorInfo = '验证失败,请一个小时后再验证！';
            }
          }else{
            errorInfo = '验证失败,' + res.msg;
          }

          Global.ui.notification.show(errorInfo);
        }
      });
    }
  },

  emailFindBlack:function(){
    $('.panel02').removeClass('hidden');
    $('.emailFind').addClass('hidden');
  },

  openSafetyEmail:function(){
    $('.panel02').addClass('hidden');
    $('.emailFind').removeClass('hidden');

    $('.js-emailSendLoading').removeClass('hidden');
    this.sendEmail().fail(function () {
      $('.js-emailSendLoading').addClass('hidden');
      Global.ui.notification.show('邮件发送失败，网络异常');
    }).done(function (res) {
      $('.js-emailSendLoading').addClass('hidden');
      if (res && res.result === 0) {
        
        $('.js-emailTime').html(50);
        var emailTime = setInterval(function(){
          var num = $('.js-emailTime').html() - 1;
          if ($('.js-emailTime').html() == 0) {
            clearInterval(emailTime)
          }
          else{
            $('.js-emailTime').html(num);
          }
        }, 1000)
      } else {
        Global.ui.notification.show(res.msg);
      }
    });
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
    var self = this;
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

    $('.js-rp-valCode').on('input', function() {
      if ($('.js-rp-valCode').val().length == 4) {
        Global.sync.ajax({
          type: 'POST',
          url: '/acct/imgcode/val.json',
          data: {
            code: $('.js-rp-valCode').val()
          }
        }).done(function (data, status, xhr) {
          if (data.result === 0) {
            $('.js-code').removeClass('wrong');
            $('.js-code').addClass('correct');
          }else{
            self.refreshValCodeHandler();
            $('.js-code').addClass('wrong');
            $('.js-code').removeClass('correct');
          }
        }).fail(function () {
            self.refreshValCodeHandler();
            Global.ui.notification.show('验证码报错');
        });
      }
    });
  },

  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCode.val('');
  },

  verifyUNHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);

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
      $target.button('loading');

      //校验验证码
      this.verifyUserNameXhr().always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('网络异常');
      }).done(function (res) {
        if (res && res.result === 0) {
          $('.leftMenu-julien div b').removeClass('red');
          $('.leftMenu-julien div b').eq(1).addClass('red');
          $('.panel01').addClass('hidden');
          $('.panel02').removeClass('hidden');
          $('.panel02 div span').html($('#jsRPUserName').val());
          self.refreshValCodeHandler();
          sessionStorage.setItem('pwdToken', res.root.pwdToken);

          if (res.root.qesStatus == 1) {
            $('.safety-questionid span').removeClass('hidden');
          }
          else{
            $('.safety-questionid button').removeClass('hidden');
          }
          if (res.root.payPwdStatus == 0) {
            $('.safety-passwd span').removeClass('hidden');
          }
          else{
            $('.safety-passwd button').removeClass('hidden');
          }
          if (res.root.email == '') {
            $('.safety-email dd span').removeClass('hidden');
          }
          else{
            $('.safety-email dt span').html('您绑定的邮箱为 ' + res.root.email);
            $('.safety-email button').removeClass('hidden');
            $('.emailFind h1').html('登录密码找回邮件已发送至您的邮箱：' + res.root.email);
          }
        } else {
          Global.ui.notification.show('用户名验证失败');
        }
      });
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

  //TODO 重置登录密码 ，待修改参数名
  resetLoginPwd: function(){
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/resetloginpwd.json',
      data: {
        loginPwd: $('.js-rp-loginPwd1').val(),
        username: $('.panel02 div span').html(),
        loginToken: sessionStorage.getItem('pwdToken')
      }
    });
  },

  //TODO 验证资金密码 ，待修改参数名
  verifyFundPassword: function () {
    return $.ajax({
      type: 'POST',
      url: '/fund/moneypd/verpwdforloginpwd.json',
      data: {
        payPwd: $('.js-moneyPasswdInput').val(),
        username: $('.panel02 div span').html(),
        loginToken: sessionStorage.getItem('pwdToken')
      }
    });
  },

  //TODO 验证密保 ，待修改参数名
  verifySecurityQuestion: function () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/usersecurity/verqesforloginpwdByName.json',
      data: {
        'secrityList[0].securityId': $('.js-safety-problem dd').eq(0).data('id'),
        'secrityList[0].securityQes': $('.js-safety-problem dd').eq(0).html(),
        'secrityList[0].securityAsw': $('.js-answer1').val(),
        'secrityList[1].securityId': $('.js-safety-problem dd').eq(2).data('id'),
        'secrityList[1].securityQes': $('.js-safety-problem dd').eq(2).html(),
        'secrityList[1].securityAsw': $('.js-answer2').val(),
        'secrityList[2].securityId': $('.js-safety-problem dd').eq(4).data('id'),
        'secrityList[2].securityQes': $('.js-safety-problem dd').eq(4).html(),
        'secrityList[2].securityAsw': $('.js-answer3').val(),
         username: $('.panel02 div span').html()
      }
    });
  },

  //TODO 获取安全问题
  getUserEcurityQes: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/usermsg/validSecurity.json',
      data: {
        username: $('.panel02 div span').html()
      }
    });
  },

  //TODO 获取邮件验证
  getEmail: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/usermsg/validSecurity.json',
      data: {
        userName: $('.panel02 div span').html()
      }
    });
  },

  //TODO 发送邮件
  sendEmail: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/usermsg/sendEmail.json',
      data: {
        userName: $('.panel02 div span').html()
      }
    });
  }
});

$(document).ready(function() {
  $('.js-package').resetPassword();
});
