"use strict";


var ConfirmView = require('accountCenter/views/setEmailConfirm');

var contentEmailView = Base.ItemView.extend({

    template: require('accountCenter/templates/verifyOldEmail.html'),

    className: 'as-securityQuestion-view',

    events: {
        'click .js-ac-next': 'nextHandler' //输入密保问题(与修改页面共用)
    },

    initialize: function () {

    },

    onRender: function () {
        this.$setEmail = this.$('.js-set-email');
        this.$('.js-old-email').html(this.options.oldEmial);

    },

    nextHandler: function (e) {

        var self = this;
        var $target = $(e.currentTarget);
        $target.button('loading');
        Global.sync.ajax({
                url: '/acct/usermsg/sendEmail.json'
            })
            .always(function() {
                $target.button('reset');
            })
            .done(function(res) {
                if (res && res.result === 0) {

                    alert(res);

                    // var confirm = new ConfirmView({email:self.$setEmail.val()});
                    // $('.js-acse-container').html(confirm.render().el);
                    // this.destroy();

                }else {
                    Global.ui.notification.show(res.msg);
                }

            });
        
        

    }


});

module.exports = contentEmailView;
