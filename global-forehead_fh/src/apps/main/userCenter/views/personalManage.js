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
          self.$('.js-uc-qqNum').val(res.root.userQq);
          self.$('.js-uc-eMail').val(res.root.userEmail);
          self.$('.js-uc-tel').val(res.root.userCellphone);

          self.$('.js-vip').text(res.root.memberLevel);
          self.$('.js-integral').text(res.root.integral);

          var userSex = res.root.userSex;
          if (userSex == 1) {
            self.$('.gender input').eq(0).attr("checked", "true");
          }
          else if (userSex == 2) {
            self.$('.gender input').eq(1).attr("checked", "true");
          }

          var bday = res.root.userBithday;

          if(bday != null && bday != '') {
            var bday =bday.split("-");
     
            self.$('.js-bday1').val(bday[0]);
            self.$('.js-bday2').val(bday[1]);
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

    var userSex = $("input[name='gender']:checked").val();
    if (userSex == undefined) {
      userSex = 0;
    }

    Global.sync.ajax({
      url: '/acct/userinfo/saveuser.json',
      data: {
        userQqNum: this.$('.js-uc-qqNum').val(),
        userEmail: this.$('.js-uc-eMail').val(),
        uName: this.$('.js-uc-uName').val(),
        userBirthday: (this.$('.js-bday1').val() +'-'+ this.$('.js-bday2').val()),
        userSex: userSex,
        userCellphone: this.$('.js-uc-tel').val()
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
