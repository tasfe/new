define(function (require, exports, module) {

  var UpdatePasswordView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/updatePassword.html'),

    events: {
      'click .js-cc-btn-submit': 'updatePwdHandler'
    },
    initialize: function () {
    },
    onRender: function () {
      var self=this;
      self.$('.js-cc-username').html('<label class="control-label" >'+Global.memoryCache.get('acctInfo').username+'</label>');
    },
    updatePwdHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = this.$('.js-cc-update-pwd-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/sysusermng/updatepwd.json',
          data: {
            oldPwd: this.$('.js-cc-oPassword').val(),
            password: this.$('.js-cc-repeatPassword').val()
          }
          ,
          tradition:true
        })
            .always(function () {
              $target.button('reset');
            })
            .fail(function () {
              // 处理失败
            })
            .done(function (res) {
              if (res && res.result === 0) {
                Global.ui.notification.show('操作成功。');
                Global.appRouter.navigate(_('#am/up').addHrefArgs({_t: _.now()}), {
                  trigger: true,
                  replace: false
                });
              } else {
                Global.ui.notification.show(res.msg!=='fail'?res.msg:'操作失败。');
              }
            });
      }else{
        $target.button('reset');
      }
    }

  });

  module.exports = UpdatePasswordView;
});
//56250