"use strict";

var FundPwdView = Base.ItemView.extend({

  template: require('accountCenter/templates/passwordManage-fundPwd.html'),

  startOnLoading: true,

  events: {
    'click .js-ac-setFundPassword-submit': 'setFundPasswordHandler'
  },

  onRender: function() {
    var self = this;

    this.$setFundPasswordForm = this.$('.js-ac-setFundPassword-form');
    this.$setFundPasswordForm.addClass('hidden');

    //然后查询是否设置了资金密码
    Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function (res) {
        if (res && res.result === 0) {
          //0表示设置了资金密码，则需要展示修改资金密码页面
          //隐藏提示信息
          self.$('.js-ac-noFundPasswordNoticeBar').addClass('hidden');
          //显示输入框，并将其中的input置为有效状态
          self.$('.js-ac-oldFundPwdContainer').removeClass('hidden').find('input').prop('disabled', false);
          self.$('.js-ac-oldFundPwdContainer').removeClass('hidden').find('input').attr('type', 'password');
          //设置按钮点击时触发事件的类型标示
          self.$('.js-ac-setFundPassword-submit').data('type', 'update');
          //展示页面
          self.$setFundPasswordForm.removeClass('hidden');
          self._parentView.$('a[href=#jsFundManage]').html('<span>修改资金密码</span>');
        } else if (res && res.result === 1) {
          //1表示未设置资金密码，则需要展示设置资金密码页面
          //显示设置提示框
          self.$('.js-ac-noFundPasswordNoticeBar').removeClass('hidden');
          //隐藏输入框，并将其中的input置为失效状态
          self.$('.js-ac-oldFundPwdContainer').addClass('hidden').find('input').prop('disabled', true);
          self.$('.js-ac-oldFundPwdContainer').addClass('hidden').find('input').attr('type', 'hidden');
          //设置按钮点击时触发事件的类型标示
          self.$('.js-ac-setFundPassword-submit').data('type', 'add');
          //展示页面
          self.$setFundPasswordForm.removeClass('hidden');
          self._parentView.$('a[href=#jsFundManage]').html('<span>设置资金密码</span>');
        } else {
          //其他情况隐藏该页面
          self.$setFundPasswordForm.addClass('hidden');
        }
      });
  },

  setFundPasswordHandler: function(e) {
    var $target = $(e.currentTarget);
    var self = this;
    var type = $target.data('type');
    var clpValidate = this.$setFundPasswordForm.parsley().validate();
    if (clpValidate) {
      $target.button('loading');
      if (type === 'add') {
        Global.sync.ajax({
          url: '/fund/moneypd/savepaypwd.json',

          data: {
            payPwd: this.$('#newUpdateFundPassword').val()
          }
        })
          .always(function () {
            $target.button('reset');
          })
          .done(function (res) {
            if (res && res.result === 0) {
              //suc
              Global.ui.notification.show('设置密码成功');
              self.render();
            } else {
              //fail
              Global.ui.notification.show(res.msg);
            }
          });
      } else if (type === 'update') {
        Global.sync.ajax({
          url: '/acct/userinfo/updatepaypwd.json',
          data: {
            oldPayPwd: this.$('#oldFundPassword').val(),
            payPwd: this.$('#newUpdateFundPassword').val()
          }
        })
          .always(function () {
            $target.button('reset');
          })
          .done(function (res) {
            if (res && res.result === 0) {
              //suc
              Global.ui.notification.show('修改资金密码成功', {
                type: 'success'
              });
              self.render();
            } else {
              //fail
              if(_(res.root).isNumber&&res.root > 0){
              Global.ui.notification.show('验证失败，剩余&nbsp;' + res.root+'&nbsp;次机会');
              }else{
                Global.ui.notification.show("验证失败，请一个小时后再验证！");
              }
            }
          });
      }

    }
  }
});

module.exports = FundPwdView;
