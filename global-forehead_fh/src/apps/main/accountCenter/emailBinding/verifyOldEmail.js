"use strict";

var inputNewEmail = require('./inputNewEmail');

var verifyOldEmail = Base.ItemView.extend({

    template: require('./verifyOldEmail.html'),

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
                url: '/acct/usermsg/sendEmailToken.json',
                data:{
                    sendType:1
                }
            })
            .always(function() {
                $target.button('reset');
            })
            .done(function(res) {
                if (res && res.result === 0) {
                    
                    var newEmail = new inputNewEmail();
                    $('.js-acse-container').html(newEmail.render().el);
                    self.destroy();

                }else {
                    Global.ui.notification.show(res.msg);
                }
            
            });
        

    }


});

module.exports = verifyOldEmail;
