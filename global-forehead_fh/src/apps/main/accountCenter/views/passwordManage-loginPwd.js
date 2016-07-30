"use strict";

var LoginPwdView = Base.ItemView.extend({

  template: require('accountCenter/templates/passwordManage-login.html'),

  className: 'as-loginPwd-view',

  //绑定事件
  events: {
    //修改登陆密码
    'click .js-changeLoginPassword-submit': 'changeLoginPasswordHandler'
  },

  onRender: function () {
    var self = this;

    this.$changeLoginPasswordForm = this.$('.js-ac-changeLoginPassword-form');

    var newLoginPassword = _(function() {
      var str= $('#newLoginPassword').val();

      if ( !isNaN(str) && str.length < 9 ) {
        $('.js-tip').html('*不能是9位以下的纯数字（≤8个阿拉伯数字）');
        $('.js-tip').removeClass('hide');
        $('.js-help-inline').addClass('red');

        $('.js-tip').removeClass('hide');
        $('.js-forbidden-button').removeClass('hide');
        $('.js-changeLoginPassword-submit').addClass('hide');
      }
      else if(str.indexOf(" ")>0){
        $('.js-tip').html('*不能包含空格');
        $('.js-tip').removeClass('hide');
        $('.js-help-inline').addClass('red');

        $('.js-tip').removeClass('hide');
        $('.js-forbidden-button').removeClass('hide');
        $('.js-changeLoginPassword-submit').addClass('hide');
      }
      else if (str.length < 6 || str.length > 20) {
        $('.js-tip').html('*6-20位字符组成');
        $('.js-tip').removeClass('hide');
        $('.js-help-inline').addClass('red');

        $('.js-tip').removeClass('hide');
        $('.js-forbidden-button').removeClass('hide');
        $('.js-changeLoginPassword-submit').addClass('hide');
      }
      else{
        $('.js-help-inline').removeClass('red');
        $('.js-tip').addClass('hide');
        $('.js-forbidden-button').addClass('hide');
        $('.js-changeLoginPassword-submit').removeClass('hide');
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
        if (num == 3) {
          $('.js-passwdSafetyTips span').addClass('s3');
          $('.js-passwdSafetyTips b').addClass('s3');
          $('.js-passwdSafetyTips b').html('强');
        }
        if (num == 2) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s2');
          $('.js-passwdSafetyTips span').eq(1).addClass('s2');
          $('.js-passwdSafetyTips b').addClass('s2');
          $('.js-passwdSafetyTips b').html('中');
        }
        if (num == 1) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s1');
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

    this.$('#newLoginPassword').on('keypress', newLoginPassword);
  },

  changeLoginPasswordHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

  


    var clpValidate = this.$changeLoginPasswordForm.parsley().validate();
    if (clpValidate) {
      $target.button('loading');

      Global.sync.ajax({
        url: '/acct/userinfo/updateloginpwd.json',

        data: {
          oldPwd: this.$('#oldLoginPassword').val(),
          NewPwd: this.$('#newLoginPassword').val()
        }
      })
      .always(function() {
        $target.button('reset');
      })
      .done(function (res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('修改密码成功', {
            type: 'success'
          });
          self.render();
           
          //var LoginOutTips = require('com/loginOutTips');
          //this.loginOutTips = new LoginOutTips();
          //this.loginOutTips.checkState();
          Global.sync.setLogout();
      
        } else {
          if(res.msg=="fail"&&(res.root!=null)){
          Global.ui.notification.show("验证失败，"+res.root);
          }else{
            Global.ui.notification.show("验证失败，"+res.msg);
          }
        }
      });
    }
  }
});

module.exports = LoginPwdView;
