"use strict";

var FundPwdView = Base.ItemView.extend({

  template: require('./index.html'),

  completeTpl: _.template(require('../templates/completePage.html')),

  startOnLoading: true,

  events: {
    'click .js-ac-setFundPassword-submit': 'setFundPasswordHandler',
    'keyup #newUpdateFundPassword': 'validatePwdHandler',
    'click .js-pm-confirm': 'refreshPageHandler'
  },

  validatePwdHandler: function (e) {
    var $target = $(e.currentTarget);
    var pwd = $target.val();
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

  onRender: function() {
    var self = this;
    this.$setFundPasswordForm = this.$('.js-ac-setFundPassword-form');
    this.$pwdTip = this.$('.js-invalid-pwd-tip');
    this.$submitBtn = this.$('.js-ac-setFundPassword-submit');
    this.$saftyLevel = this.$('.js-passwdSafetyTips');
    this.$newPwd = this.$('#newUpdateFundPassword');

    //查询是否设置了资金密码
    Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function (res) {
        if (res && res.result === 0) {
          //0表示设置了资金密码，则需要展示修改资金密码页面
          //显示输入框，并将其中的input置为有效状态
          self.$('.js-ac-oldFundPwdContainer').removeClass('hidden').find('input').prop('disabled', false);
          self.$('.js-ac-oldFundPwdContainer').removeClass('hidden').find('input').attr('type', 'password');

          self.$('.js-ac-setFundPassword-submit').data('type', 'update');//设置按钮点击时触发事件的类型标示
          self.$('.portlet-title').html('修改资金密码');
          self.$('.js-ac-forgetPwd').removeClass('hidden');
        } else if (res && res.result === 1) {
          //1表示未设置资金密码，则需要展示设置资金密码页面
          //隐藏输入框，并将其中的input置为失效状态
          self.$('.js-ac-oldFundPwdContainer').addClass('hidden').find('input').prop('disabled', true);
          self.$('.js-ac-oldFundPwdContainer').addClass('hidden').find('input').attr('type', 'hidden');

          self.$('.js-ac-setFundPassword-submit').data('type', 'add');//设置按钮点击时触发事件的类型标示
          self.$('.portlet-title').html('设置资金密码');
        } else {
          //其他情况隐藏该页面
          self.$setFundPasswordForm.addClass('hidden');
        }
      });
  },

  setFundPasswordHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');
    var clpValidate = this.$setFundPasswordForm.parsley().validate();

    if (clpValidate) {
      $target.button('loading');
      if (type === 'add') {
        Global.sync.ajax({
          url: '/fund/moneypd/savepaypwd.json',
          data: {
            payPwd: this.$newPwd.val()
          }
        }).always(function () {
          $target.button('reset');
        }).done(function (res) {
          if (res && res.result === 0) {
            // Global.ui.notification.show('设置密码成功');
            // self.render();
            self.$el.html(self.completeTpl({
              title: '设置成功',
              content: '资金密码设置成功'
            }));
          } else {
            Global.ui.notification.show(res.msg);
          }
        });
      } else if (type === 'update') {
        Global.sync.ajax({
          url: '/acct/userinfo/updatepaypwd.json',
          data: {
            oldPayPwd: this.$('#oldFundPassword').val(),
            payPwd: this.$newPwd.val()
          }
        }).always(function () {
          $target.button('reset');
        }).done(function (res) {
          if (res && res.result === 0) {
            // Global.ui.notification.show('修改资金密码成功', {
            //   type: 'success'
            // });
            // self.render();
            self.$el.html(self.completeTpl({
              title: '修改成功',
              content: '资金密码修改成功'
            }));
          } else {
            if(_(res.root).isNumber && res.root > 0){
              Global.ui.notification.show(res.msg + ',验证失败，剩余&nbsp;' + res.root + '&nbsp;次机会');
            }else{
              Global.ui.notification.show("验证失败，请一个小时后再验证！");
            }
          }
        });
      }
    }
  },

  refreshPageHandler: function () {
    this.render();
  }
});

module.exports = FundPwdView;
