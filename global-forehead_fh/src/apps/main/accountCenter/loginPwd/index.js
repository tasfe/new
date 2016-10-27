"use strict";

var LoginPwdView = Base.ItemView.extend({

  template: require('./index.html'),

  completeTpl: _.template(require('../templates/completePage.html')),

  className: 'as-loginPwd',

  //绑定事件
  events: {
    'click .js-changeLoginPassword-submit': 'changeLoginPasswordHandler',    //修改登陆密码
    'keyup #newLoginPassword': 'validatePwdHandler',
    'click .js-pm-confirm': 'reloginHandler'
  },

  onRender: function () {
    this.$changeLoginPasswordForm = this.$('.js-ac-changeLoginPassword-form');
    this.$pwdTip = this.$('.js-invalid-pwd-tip');
    this.$submitBtn = this.$('.js-changeLoginPassword-submit');
    this.$saftyLevel = this.$('.js-passwdSafetyTips');

    var acctInfo = Global.memoryCache.get('acctInfo');
    if(!_.isNull(acctInfo.uName) && !_.isUndefined(acctInfo.uName) && acctInfo.uName != ""){
      this.uName = acctInfo.uName;
    }else{
      this.uName = acctInfo.username;
    }
  },

  validatePwdHandler: function (e) {
    var $target = $(e.currentTarget);
    var pwd= $target.val();
    var safety = 0;

    if ( !isNaN(pwd) && pwd.length < 9 ) {
      
      this.$pwdTip.html('*新密码不能是9位以下的纯数字（≤8个阿拉伯数字）').removeClass('hidden');
      this.$submitBtn.attr('disabled', 'disabled');
    } else if(pwd.indexOf(" ")>0){
      
      this.$pwdTip.html('*新密码不能包含空格').removeClass('hidden');
      this.$submitBtn.attr('disabled', 'disabled');
    } else if (pwd.length < 6 || pwd.length > 20) {
      
      this.$pwdTip.html('*新密码必须由6-20位字符组成').removeClass('hidden');
      this.$submitBtn.attr('disabled', 'disabled');
    } else{
      
      this.$pwdTip.addClass('hidden');
      this.$submitBtn.removeAttr('disabled');
    }

    if ( pwd.length > 0 ) {
      this.$saftyLevel.removeClass('hidden');
      if(/\d/gi.test(pwd)){
        safety++;
      }
      if (/[A-Za-z]/.test(pwd)) {
        safety++;
      }
      if(/[@#\$%\^&\*\!]+/g.test(pwd)){
        safety++;
      }
    } else {
      this.$saftyLevel.addClass('hidden');
    }

    this.$saftyLevel.removeClass('level1').removeClass('level2').removeClass('level3');
    if (safety == 3) {
      this.$saftyLevel.addClass('level3').find('b').html('强');
    }
    if (safety == 2) {
      this.$saftyLevel.addClass('level2').find('b').html('中');
    }
    if (safety == 1) {
      this.$saftyLevel.addClass('level1').find('b').html('弱');
    }
  },

  changeLoginPasswordHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    
    var clpValidate = this.$changeLoginPasswordForm.parsley(Global.validator.getInlineErrorConfig()).validate();
    if (clpValidate) {
      $target.button('loading');



      Global.sync.ajax({
        url: '/acct/userinfo/updateloginpwd.json',

        data: {
          uName:this.uName,
          oldPwd: this.$('#oldLoginPassword').val(),
          NewPwd: this.$('#newLoginPassword').val()
        }
      })
      .always(function() {
        $target.button('reset');
      })
      .done(function (res) {
        if (res && res.result === 0) {
          // Global.ui.notification.show('修改密码成功', {
          //   type: 'success'
          // });
          // self.render();
          self.$el.html(self.completeTpl({
            title: '修改成功',
            content: '登录密码修改成功，请重新登录'
          }));
          setTimeout(function(){
            Global.oauth.logout().done(function(data) {
              if(data && data.result === 0) {
                Global.cookieCache.clear('token');
                Global.sessionCache.clear('hasLoadBulletin');
                window.location.href = 'login.html';
              }
            }).always(function() {
              Global.ui.loader.hide();
            });
          }, 2000);

        } else {
          if(res.msg=="fail"&&(res.root!=null)){
          Global.ui.notification.show("验证失败，"+res.root);
          }else{
            Global.ui.notification.show("验证失败，"+res.msg);
          }
        }
      });
    }
  },
  reloginHandler: function () {
    Global.sync.setLogout();
    window.location.href = 'login.html';
  }
});

module.exports = LoginPwdView;
