"use strict";

var FundPwdView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-ac-setFundPassword-submit': 'setFundPasswordHandler'
  },

  onRender: function() {
    var self = this;

    this.$setFundPasswordForm = this.$('.js-ac-setFundPassword-form');
    this.$setFundPasswordForm.addClass('hidden');
    //Julien检查代码
    var newUpdateFundPassword = _(function() {
      var str= $('#newUpdateFundPassword').val();

      if ( !isNaN(str) && str.length < 9 ) {
        $('.js-tip2').html('*不能是9位以下的纯数字（≤8个阿拉伯数字）');
        $('.js-tip2').removeClass('hide');
        $('.js-help-inline2').addClass('red');

        $('.js-tip2').removeClass('hide');
        $('.js-forbidden-button2').removeClass('hide');
        $('.js-ac-setFundPassword-submit').addClass('hide');
      }
      else if(str.indexOf(" ")>0){
        $('.js-tip2').html('*不能包含空格');
        $('.js-tip2').removeClass('hide');
        $('.js-help-inline2').addClass('red');

        $('.js-tip2').removeClass('hide');
        $('.js-forbidden-button2').removeClass('hide');
        $('.js-ac-setFundPassword-submit').addClass('hide');
      }
      else if (str.length < 6 || str.length > 20) {
        $('.js-tip2').html('*6-20位字符组成');
        $('.js-tip2').removeClass('hide');
        $('.js-help-inline2').addClass('red');

        $('.js-tip2').removeClass('hide');
        $('.js-forbidden-button2').removeClass('hide');
        $('.js-ac-setFundPassword-submit').addClass('hide');
      }
      else{
        $('.js-help-inline2').removeClass('red');
        $('.js-tip2').addClass('hide');
        $('.js-forbidden-button2').addClass('hide');
        $('.js-ac-setFundPassword-submit').removeClass('hide');
      }

      var num = 0;
      var num2 = 0;
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

        $('.js-passwdSafetyTips2 span').removeClass('s3').removeClass('s2').removeClass('s1');
        $('.js-passwdSafetyTips2 b').removeClass('s3').removeClass('s2').removeClass('s1');
        if (num == 3) {
          $('.js-passwdSafetyTips2 span').addClass('s3');
          $('.js-passwdSafetyTips2 b').addClass('s3');
          $('.js-passwdSafetyTips2 b').html('强');
        }
        if (num == 2) {
          $('.js-passwdSafetyTips2 span').eq(0).addClass('s2');
          $('.js-passwdSafetyTips2 span').eq(1).addClass('s2');
          $('.js-passwdSafetyTips2 b').addClass('s2');
          $('.js-passwdSafetyTips2 b').html('中');
        }
        if (num == 1) {
          $('.js-passwdSafetyTips2 span').eq(0).addClass('s1');
          $('.js-passwdSafetyTips2 b').addClass('s1');
          $('.js-passwdSafetyTips2 b').html('弱');
        }

        num = 0;
      }

      if (str.length != 0) {
        $('.js-passwdSafetyTips2').removeClass('hide');
      }
      else{
        $('.js-passwdSafetyTips2').addClass('hide');
      }

    }).debounce(400);

    this.$('#newUpdateFundPassword').on('keypress', newUpdateFundPassword);
    //////////////////////////////////



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
          self.$('.js-ac-noFundPasswordNoticeBar').addClass('hide');
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
