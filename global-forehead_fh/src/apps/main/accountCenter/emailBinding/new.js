"use strict";

var SettingEmail = Base.ItemView.extend({

  template: require('./new.html'),

  className: 'as-personalManage',

  startOnLoading: false,

  events: {
    // 'click .js-modify-email': 'modifyEmailHandler'
    'click .js-as-inputEmail-submit': 'inputEmailHandler',
    'click .js-as-confirmEmail-submit': 'confirmEmailHandler',
    'click .js-as-resendEmail': 'resendEmailHandler',
    'click .js-as-confirmEmail-return': 'returnHandler'
  },

  initialize: function() {
  },
  onRender: function() {
    var self = this;

    this.$emailBindingontainer = this.$('.js-as-emailBinding');
    self._initSteps(self.$emailBindingontainer, function(event, currentIndex, newIndex) {
      return newIndex !== 3;
    });
  },

  _initSteps: function($Container, changingFunc) {
    $Container.steps({
      stepLength: 540,
      headerTag: 'h3',
      bodyTag: 'form',
      forceMoveForward: false,//允许返回
      enablePagination: false,
      transitionEffect: "slideLeft",
      onStepChanging: changingFunc
    });
  },

  inputEmailHandler: function(e) {
    var self = this;

    var $form = this.$('.js-as-inputEmailForm');
    var $target = $(e.currentTarget);

    var parsley = $form.parsley(Global.validator.getInlineErrorConfig());
    var inputParsley = $form.find('[name=email]').parsley();

    if (!parsley.validate()) {
      return false;
    }
    ParsleyUI.removeError(inputParsley, 'remoteError');

    var email = _(self.$('.js-as-newEmail').val()).trim();

    $target.button('loading');

    Global.sync.ajax({
      url: '/acct/email/exist.json',
      data: {
        email: email
      }
    }).always(function() {
      $target.button('reset');
    }).done(function(res) {

      if(res && res.result === 0) {
        self.email = email;
        self.$('.js-as-email-res').text(res.root);
        self.$('.js-as-stepContainer').steps('next');
      } else {
        ParsleyUI.addError(inputParsley, 'remoteError', res.msg);

        // Global.ui.notification.show(res.msg);
      }
    });
  },

  confirmEmailHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $verifyCode = this.$('.js-as-email-verifyCode');
    var $form = this.$('.js-pm-check-code');

    var parsley = $form.parsley(Global.validator.getInlineErrorConfig());
    var inputParsley = $form.find('[name=code]').parsley();

    ParsleyUI.removeError(inputParsley, 'remoteError');

    if (!parsley.validate()) {
      return false;
    }

    $target.button('loading');

    Global.sync.ajax({
      url: '/acct/email/newbind.json',
      data: {
        code: _.trim($verifyCode.val()),
        email: this.email
      }
    }).always(function() {
      $target.button('reset');
    }).done(function(res) {
      if(res && res.result === 0) {
        Global.m.states.fetch();
        var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
        $currentContainer.steps('next');
        self.$('.js-as-email').html(res.root);
      } else {
        ParsleyUI.addError(inputParsley, 'remoteError', res.msg);
      }
    });
  },

  _reverseCountDown: function() {
    var self = this;
    var $countdown = this.$('.js-as-resend-countdown');
    var $resendBtn = this.$('.js-as-resendEmail');
    $countdown.html(120);
    $resendBtn.prop('disabled', true).text('重新发送邮件');

    clearInterval(this.emailTime);

    this.emailTimer = setInterval(function(){
      var num = $countdown.html() - 1;
      if ($countdown.html() == 0) {
        clearInterval(self.emailTimer);
        $resendBtn.prop('disabled', false);
        $countdown.html(0);
      }else{
        $countdown.html(num);
      }
    }, 1000);
  },

  resendEmailHandler: function(e) {

    this._reverseCountDown();

    Global.sync.ajax({
      url: '/acct/email/newsend.json',
      data: {
        email: this.email
      }
    });
  },

  returnHandler: function(e) {
    var $target = $(e.currentTarget);
    var type = $target.data('type');//需要返回的步骤记录在此

    var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
    $currentContainer.steps('goTo', type);

    var $countdown = this.$('.js-as-resend-countdown');
    var $resendBtn = this.$('.js-as-resendEmail');
    clearInterval(this.emailTime);
    $resendBtn.prop('disabled', false);
    $countdown.html(0);
  }
});

module.exports = SettingEmail;