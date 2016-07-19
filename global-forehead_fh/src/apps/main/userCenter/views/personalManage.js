"use strict";

var PersonalManageView = Base.ItemView.extend({

  template: require('userCenter/templates/personalManage.html'),

  startOnLoading: true,

  events: {
    'submit .js-uc-personalManage-form': 'updatePersonalInfoHandler',
    'click .js-uc-reset': 'resetPageHandler'
  },

  onRender: function() {
    var self = this;

    Global.sync.ajax({
      url: '/acct/userinfo/userdetail.json',
      data: {}
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function (res) {
        if (res && res.result === 0) {

          self.$('.js-uc-userName').html(res.root.userName);
          self.$('.js-uc-uName').val(res.root.uName);
          self.$('.js-uc-balance').html(_(res.root.balance).convert2yuan());
          self.$('.js-uc-regTime').html(_(res.root.userRegTime).toTime());
          self.$('.js-uc-qqNum').val(res.root.userQq);
          self.$('.js-uc-eMail').val(res.root.userEmail);
          self.$('.js-uc-userLevel').html('V'+res.root.memberLevel);
          self.$('.js-uc-userPoints').html(res.root.integral/10000);
          var bday = res.root.userBithday;
          if(bday != null && bday != '') {
            var bday =bday.split("-");
            self.$('.js-bday1').val(parseInt(bday[0]));
            self.$('.js-bday2').val(parseInt(bday[1]));
            self.$('.js-bday1').attr("disabled",true);
            self.$('.js-bday2').attr("disabled",true);
          }

        } else {
          Global.ui.notification.show('获取用户个人信息失败');
        }
      });

    this.$form = this.$('.js-uc-personalManage-form');
    this.$userUName = this.$('.js-uc-uName');
    this.$userUNameValRes = this.$('.js-uc-userUName-val-res');
    this.$btnConfirm = this.$('.js-uc-confirm');

    this.parsley = this.$form.parsley();

    window.ParsleyExtend.addAsyncValidator('checkusername', function(xhr) {
      return xhr.responseJSON.result === 0;
    }, '/acct/userinfo/checkuname.json');
  },

  updatePersonalInfoHandler: function(e) {
    var self = this;
    this.$btnConfirm.button('loading');

    Global.sync.ajax({
      url: '/acct/userinfo/saveuser.json',
      data: {
        userQqNum: this.$('.js-uc-qqNum').val(),
        userEmail: this.$('.js-uc-eMail').val(),
        userUname: this.$('.js-uc-uName').val(),
        userBirthday: (this.$('.js-bday1').val() +'-'+ this.$('.js-bday2').val())
      }
    })
      .always(function() {
        self.$btnConfirm.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('修改个人信息成功', {
            type: 'success'
          });
        } else {
          Global.ui.notification.show('修改个人信息失败');
        }
      });
  }
});

module.exports = PersonalManageView;
