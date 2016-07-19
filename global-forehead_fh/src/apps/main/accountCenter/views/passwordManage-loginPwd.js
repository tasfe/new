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
