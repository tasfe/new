"use strict";

require('./index.scss');

var FirstLoginUpdatePasswd = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-affirm': 'affirm',
    'click .js-close': 'close',
    'click .js-close2': 'close2'
  },

  initialize: function() {
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
    });

  },
  onRender: function(){
    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-fl-up-username').html(acctInfo.username);
  },

  affirm: function () {
    var self = this;
    var $form = this.$('.js-fl-up-form');
    var validate = $form.parsley().validate();
    if(validate){
      if(this.loginPwd(1) == 1)
      {
        this.updateLoginPwdAndUName().done(function (data) {
          if (data.result === 0) {
            $('.js-firstLoginUpdatePasswd .js-window').addClass('hidden');
            $('.js-firstLoginUpdatePasswd .js-window2').removeClass('hidden');

            sessionStorage.status = 0;

            Global.sync.setLogout();
          } else {
            Global.ui.notification.show(data.msg);
          }
        })
          .always(function() {
            $('.js-firstLoginUpdatePasswd .js-affirm').text('确认');
          });
      }
    }

  },

  close: function () {
    this.trigger('close');

    this.destroy();
  },

  close2: function () {
    window.location.href = 'login.html';
  },

  loginPwd: function(is) {
    var str= $('.js-firstLoginUpdatePasswd .js-loginPwd').val();

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
      $('.js-passwdSafetyTips p').removeClass('s3').removeClass('s2').removeClass('s1');
      if (num == 3) {
        $('.js-passwdSafetyTips span').eq(0).addClass('s1');
        $('.js-passwdSafetyTips span').eq(1).addClass('s2');
        $('.js-passwdSafetyTips span').eq(2).addClass('s3');
        $('.js-passwdSafetyTips p').addClass('s3');
      }
      if (num == 2) {
        $('.js-passwdSafetyTips span').eq(0).addClass('s1');
        $('.js-passwdSafetyTips p').addClass('s2');
        $('.js-passwdSafetyTips span').eq(1).addClass('s2');
      }
      if (num == 1) {
        $('.js-passwdSafetyTips span').eq(0).addClass('s1');
        $('.js-passwdSafetyTips p').addClass('s1');
      }

      num = 0;
      num = 0;
    }

    if (str.length != 0) {
      $('.passwdSafetyTips').removeClass('hidden');
    }
    else{
      $('.passwdSafetyTips').addClass('hidden');
    }

    var iIs = 0;//判断是否能够提交

    if ( !isNaN(str) && str.length < 9 ) {
      $('.js-tip').html('*不能是9位以下的纯数字（≤8个阿拉伯数字）');
      $('.js-tip').removeClass('hidden');
    }
    else if(str.indexOf(" ")>0){
      $('.js-tip').html('*不能包含空格');
      $('.js-tip').removeClass('hidden');
    }
    else if (str.length < 6 || str.length > 20) {
      $('.js-tip').html('*6-20位字符组成');
      $('.js-tip').removeClass('hidden');
    }
    else{
      $('.js-tip').html('');
      $('.js-tip').addClass('hidden');
      iIs = 1;
    }

    if (is == 1) {
      var str2= $('.js-firstLoginUpdatePasswd .js-loginPwd2').val();
      if (str2 != str) {
        $('.js-tip').html('* 两次输入不一致');
        $('.js-tip').removeClass('hidden');

        iIs = 0;
      }
    }

    return iIs;
  },

  updateLoginPwdAndUName: function () {
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/updateloginpwd.json',
      data: {
        token: Global.cookieCache.get('token'),
        uName: self.$('.js-fl-up-user-uName').val(),
        //oldPwd: this.$form.find('#oldLoginPassword').val(),
        newPwd: $('.js-firstLoginUpdatePasswd .js-loginPwd').val()
      },
      beforeSend: function (xhr, settings) {
        $('.js-firstLoginUpdatePasswd .js-affirm').text('提交中...').addClass('disabled');
      }
    });
  },

  //TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState: function(callback){
    var self = this;
    if (Number(sessionStorage.status) === 1) {
      $('body').append(self.render().$el);

      this.$('.js-firstLoginUpdatePasswd .js-loginPwd').on('input', this.loginPwd);
    }
    callback(Number(sessionStorage.status));
  }
});

module.exports = FirstLoginUpdatePasswd;