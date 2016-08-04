define(function (require, exports, module) {

    var RegisterAndLoginSetView = Base.ItemView.extend({

        template: require('text!globalCenter/templates/registerAndLoginSet.html'),

        events: {
            'click .js-rl-btn-submit': 'updateLoginConfHandle'
        },
        getLoginConfXhr: function () {
            return Global.sync.ajax({
                url: '/intra/userloginconf/getloginconf.json'
            });
        },
        onRender: function () {
            var self = this;
            self.getLoginConfXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-rl-regnum').val(res.root.loginNum);
                    self.$('.js-rl-outtime').val(res.root.loginOuttime);
                    //self.$('.js-rl-device-type[value=' + res.root.isMulipltDevice + ']').prop('checked', true);
                    //self.$('.js-rl-ie-type[value=' + res.root.isMultipleIe + ']').prop('checked', true);
                } else {
                    Global.ui.notification.show('数据异常。');
                }


            });
        },
        updateLoginConfHandle: function (e) {
            var $target = $(e.currentTarget);
            $target.button('loading');
            var clpValidate = this.$('.js-rl-login-conf-form').parsley().validate();
            if (clpValidate) {
                return Global.sync.ajax({
                    url: '/intra/userloginconf/saveloginconf.json',
                    data: {
                        isMulDevice: '0',
                        IsMulIe: '0',
                        loginNum: this.$('.js-rl-regnum').val(),
                        loginTime: this.$('.js-rl-outtime').val()
                    }
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
                          Global.appRouter.navigate(_('#gc/rl').addHrefArgs({_t: _.now()}), {
                              trigger: true,
                              replace: false

                          });
                      } else {
                          Global.ui.notification.show('操作失败。');
                      }
                  });
            }else{
              $target.button('reset');
            }

        }

    });

    module.exports = RegisterAndLoginSetView;
});