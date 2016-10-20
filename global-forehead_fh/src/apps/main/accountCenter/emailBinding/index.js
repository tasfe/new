"use strict";

var ContentEmailView = require('./contentEmail');

var verifyOldEmail = require('./verifyOldEmail');

var SettingEmail = Base.ItemView.extend({

    template: require('./index.html'),

    className: 'as-personalManage',

    startOnLoading: false,
    
    events: {
        // 'click .js-modify-email': 'modifyEmailHandler'
        'click .js-as-inputEmail-submit': 'inputEmailHandler',
        'click .js-as-confirmEmail-submit': 'confirmEmailHandler',
        'click .js-as-resendEmail': 'resendEmailHandler',
        'click .js-as-confirmEmail-return': 'returnHandler',
        'click .js-pm-confirm': 'refreshPageHandler'
    },

    initialize: function() {
    },
    onRender: function() {
        var self = this;

        this.$emailBindingontainer = this.$('.js-as-emailBinding');
        self._initSteps(self.$emailBindingontainer, function (event, currentIndex, newIndex) {
            return newIndex !== 3;
        });
    },
    
    _initSteps: function ($Container, changingFunc) {
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

    inputEmailHandler: function (e) {
        var self = this;
        var $target = $(e.currentTarget);
        $target.button('loading');
        Global.sync.ajax({
              url: '/acct/userinfo/bundlEmail.json',
              data: {
                  email: self.$('.js-as-newEmail').val()
              }
          }).always(function() {
              $target.button('reset');
          }).done(function(res) {

            if (res && res.result === 0) {
                self.$('.js-as-email-res').html((self.$('.js-as-newEmail').val()).replace(/^(\w{3})(\w*)(?=@)/, '$1***'));
                self._reverseCountDown();
                self.$('.js-as-stepContainer').steps('next');
            }else {
              Global.ui.notification.show(res.msg);
            }

          });
    },

    confirmEmailHandler: function (e) {
        var self = this;
        var $target = $(e.currentTarget);
        var $verifyCode = this.$('.js-as-email-verifyCode');
        $target.button('loading');
        Global.sync.ajax({
              url: '/acct/usermsg/validateEmailCode.json',
              data:{
                  validateCode: $verifyCode.val(),
                  email: self.$('.js-as-newEmail').val()
              }
        }).always(function() {
            $target.button('reset');
        }).done(function(res) {
          if (res && res.result === 0) {
              var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
              $currentContainer.steps('next');
              self.$('.js-as-email').html((self.$('.js-as-newEmail').val()).replace(/^(\w{3})(\w*)(?=@)/, '$1***'));
          }else {
              Global.ui.notification.show(res.msg || '验证码错误');
          }

      });
    },

    _reverseCountDown:function () {
        var $countdown = this.$('.js-as-resend-countdown');
        var $resendBtn = this.$('.js-as-resendEmail');
        $countdown.html(50);
        $resendBtn.attr("disabled","disabled");

        var emailTime = setInterval(function(){
            var num = $countdown.html() - 1;
            if ($countdown.html() == 0) {
                clearInterval(emailTime);
                $resendBtn.removeAttr("disabled");
                $countdown.html(0);
            }else{
                $countdown.html(num);
            }
        }, 1000);
    },

    resendEmailHandler: function (e) {
        var self = this;
        var $target = $(e.currentTarget);
        $target.button('loading');
        Global.sync.ajax({
              url: '/acct/usermsg/sendEmailToken.json',
              data:{
                  sendType:2
              }
          })
          .always(function() {
              $target.button('reset');
          })
          .done(function(res) {
              if (res && res.result === 0) {
                  self._reverseCountDown();
              } else {
                  Global.ui.notification.show(res.msg);
              }

          });
    },

    returnHandler: function (e) {
        var $target = $(e.currentTarget);
        var type = $target.data('type');//需要返回的步骤记录在此

        var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
        $currentContainer.steps('goTo', type);
    },

    refreshPageHandler: function () {
        this.render();
    }
    // onRender: function() {
    //
    //     this.$hasEmail = false;
    //
    //     this.$verifyEmail = this.$('.js-verify-email');
    //     this.$bindEmail = this.$('.js-bind-email');
    //
    //     this.verifyHasEmail();
    // },
    //
    // verifyHasEmail:function () {
    //     var self = this;
    //     Global.sync.ajax({
    //             url: '/acct/userinfo/userdetail.json'
    //         })
    //         .always(function() {
    //             self.loadingFinish();
    //         })
    //         .done(function(res) {
    //             var data = res.root || {};
    //             if (res && res.result === 0) {
    //                 if (data.userEmail ===null){
    //
    //                     self.$hasEmail = false;
    //                     self.$bindEmail.addClass('ac-unbind-email');
    //                     var html = '未绑定邮箱 </br>请问是否需要 ' +
    //                         '<span class="js-modify-email as-launch-set text-hot" >绑定邮箱？</span>';
    //                     self.$verifyEmail.html(html);
    //
    //                 }else {
    //
    //                     self.$hasEmail = true;
    //                     self.$bindEmail.addClass('ac-binded-email');
    //                     self.$oldEmail = data.userEmail;
    //                     var html = '已绑定邮箱'+data.userEmail+' </br>请问您是否需要 ' +
    //                         '<span class="js-modify-email as-launch-set text-hot" >修改绑定邮箱？</span>';
    //                     self.$verifyEmail.html(html);
    //
    //                 }
    //             }else {
    //                 Global.ui.notification.show('加载失败，请稍后再试');
    //             }
    //
    //         });
    // },
    //
    // modifyEmailHandler:function () {
    //
    //     this.$dialog = Global.ui.dialog.show({
    //         title: '邮箱设置',
    //         size: 'modal-lg',
    //         body: '<div class="js-acse-container"></div>',
    //         bodyClass: 'ac-setemail-dialog'
    //     });
    //
    //     if (this.$hasEmail===true){
    //         var verify = new verifyOldEmail({oldEmial:this.$oldEmail});
    //         this.$dialog.find('.js-acse-container').html(verify.render().el);
    //     }else {
    //         var conetent = new ContentEmailView();
    //         this.$dialog.find('.js-acse-container').html(conetent.render().el);
    //     }
    //
    //     this.$dialog.on('hidden.modal', function () {
    //         $(this).remove();
    //     });
    //
    // }


});

module.exports = SettingEmail;