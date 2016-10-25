"use strict";

require('./index.scss');

var comingSoon =  require('base/images/coming-soon.png');

var TopProfileView;
TopProfileView = Base.ItemView.extend({

  template: require('./index.html'),

  updateUNameTpl: _(require('./updateUName.html')).template(),


  events: {
    'click .js-personal-uname-edit': 'editUNameHandler',
    'click .js-personal-avatar': 'editIconsHandler'
  },

  updateUNameXhr: function (data) {
    return Global.sync.ajax({
      url: '/acct/userinfo/updateuname.json',
      data: data
    });
  },

  onRender: function () {
    var self = this;

    this.$uName = this.$('.js-personal-u-name');
    this.$loginTime = this.$('.js-personal-login-time');
    this.$loginLoc = this.$('.js-personal-login-loc');
    this.$regTime = this.$('.js-personal-reg-time');
    this.$avatar = this.$('.js-personal-avatar');
    this.$('.js-uc-personal-profile-vip-coming-soon').attr('src', comingSoon);

    this.subscribe('acct', 'acct:updating', function () {
      self.checkState();
    });
  },

  checkState: function () {
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$uName.html(acctInfo.uName);
    this.$loginTime.html(_(acctInfo.lastLoginTime).toTime());
    this.$loginLoc.html(acctInfo.loginIp + ' ' + acctInfo.loginAdd);
    this.$regTime.html(_(acctInfo.registerTime).toTime());
    // this.$('.uc-info div span').html('您当前VIP等级：VIP' + acctInfo.memberLevel + '级');

    for (var i = 1; i <= 12; i++) {
      this.$avatar.removeClass('avatar-' + i);
    }

    this.$avatar.addClass('avatar-' + acctInfo.headId);
    this.$avatar.attr('data-type', acctInfo.headId);
  },

  //event handlers

  editIconsHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var headId = $target.attr("data-type");

    $(document).editIcons({headId:headId});
  },

  editUNameHandler: function () {
    var self = this;

    var $dialog = Global.ui.dialog.show({
      title: '修改昵称',
      body: this.updateUNameTpl()
    });

    $dialog.on('hidden.modal', function (e) {
      $(this).remove();
    });

    $dialog.off('submit.uName')
        .on('submit.uName', '.js-personal-form', function (e) {
          var $form = $(e.currentTarget);
          var $submit = $form.find('.js-btn-submit');

          var parsley = $form.parsley();

        self.updateUNameXhr(_($form.serializeArray()).serializeObject())
          .always(function() {
            $submit.button('reset');
          }).done(function (res) {
            console.log(JSON.stringify(res));
          if (res && res.result === 0) {
            Global.ui.notification.show('修改成功');
            Global.m.oauth.check();

            $dialog.modal('hide');
          } else {
            Global.ui.notification.show(res.msg === 'fail' ? '昵称重复' : res.msg);
          }

          
        });
    });
  }
});

module.exports = TopProfileView;
