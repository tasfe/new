"use strict";

var inputNewEmail = Base.ItemView.extend({

    template: require('./inputNewEmail.html'),

    success: _.template(require('./updateEmailSuccess.html')),

    className: 'as-securityQuestion-view',

    events: {
        'click .js-ac-next': 'nextHandler', //输入密保问题(与修改页面共用)
        'click .js-ac-again': 'againHandler'
    },

    initialize: function () {

    },

    onRender: function () {
        this.$setEmail = this.$('.js-set-email');
        this.$veriyCode = this.$('.js-verifyCode');
        this.reverseCountDown();
    },

    reverseCountDown:function () {
        var self = this;
        this.$('.js-waite-email-time').html('(<b class="js-emailTime">0</b>s)');
        this.$('.js-emailTime').html(50);

        this.$('.js-ac-again').attr("disabled","disabled");

        var emailTime = setInterval(function(){
            var num = $('.js-emailTime').html() - 1;
            if ($('.js-emailTime').html() == 0) {
                clearInterval(emailTime);
                self.$('.js-ac-again').removeAttr("disabled");
                self.$('.js-waite-email-time').html('');
            }else{
                $('.js-emailTime').html(num);
            }
        }, 1000);
    },

    nextHandler: function (e) {
        var self = this;
        var $target = $(e.currentTarget);
        $target.button('loading');
        Global.sync.ajax({
                url: '/acct/usermsg/validateEmailCode.json',
                data:{validateCode:self.$veriyCode.val(), email:self.$setEmail.val()}
            })
            .always(function() {
                $target.button('reset');
            })
            .done(function(res) {
                if (res && res.result === 0) {
                    $('.js-acse-container').html(self.success());
                    self.destroy();
                }else {
                    Global.ui.notification.show(res.msg);
                }

            });

    },
    againHandler:function (e) {
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
                    self.reverseCountDown();
                } else {
                    Global.ui.notification.show(res.msg);
                }

        });
    }


});

module.exports = inputNewEmail;
