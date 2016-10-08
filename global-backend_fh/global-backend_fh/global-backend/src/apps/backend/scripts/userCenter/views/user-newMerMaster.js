define(function (require, exports, module) {

  var NewSalesAccountView = Base.ItemView.extend({

    template: require('text!userCenter/templates/user-newMerMaster.html'),

    events: {
      'click .js-so-btn-submit': 'newDistributorHandler',
      'blur .js-so-username': 'checkUserExistHandler'
    },
    initialize: function () {
    },
    checkUserExistXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },

    quotaCfgXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usermanager/quotacfgdetail.json',
        data: data
      });
    },

    onRender: function () {
      var self = this;
      var data = {};
      this.quotaCfgXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.$('.js-so-quotaNum').val(res.root.merMaster[0].quotaNum);
          self.$('.js-so-mastertip').addClass('hidden');
        } else {
          if(res.msg!=='fail'){
            self.$('.js-so-quotaTip').removeClass('hidden').html(res.msg);
          }
        }
      });
    },
    newDistributorHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var $currContainer = this.$('.js-so-sales-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        $target.button('loading');
        Global.sync.ajax({
            url: '/intra/usermanager/savemermaster.json',
            data: {
              username: this.$('.js-so-username').val(),
              // userUName: this.$('.js-go-useruname').val(),
              loginPwd: this.$('.js-so-password').val(),
              quotaNum: this.$('.js-so-quotaNum').val()
            },
            tradition: true
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
              Global.appRouter.navigate(_('#uc/mm').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }
    },
    checkUserExistHandler: function (e) {
      var self = this;
      var data = {
        username: $(e.currentTarget).val()
      };
      if ($(e.currentTarget).val() == '') {
        self.$('.js-so-tip').removeClass('hidden').html("用户名不能为空");
        return;
      }
      this.checkUserExistXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.$('.js-so-tip').addClass('hidden');
        } else {
          if(res.msg!=='fail'){
            self.$('.js-so-tip').removeClass('hidden').html(res.msg);
          }
        }
      });
    }
  });

  module.exports = NewSalesAccountView;
});
//56250