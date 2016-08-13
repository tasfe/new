"use strict";

var confirmEmailView = Base.ItemView.extend({

    template: require('accountCenter/templates/setEmailConfirm.html'),

    finish: _.template(require('accountCenter/templates/setEmailFinished.html')),

    className: 'as-securityQuestion-view',

    events: {
        'click .js-fd-finished': 'nextHandler', //输入密保问题(与修改页面共用)
        'click .js-acse-back': 'acseBackHandler'
    },

    initialize: function () {

    },

    onRender: function () {

        var self = this;

        this.$('.js-fd-finished').attr("disabled","disabled");

        this.$('.js-email-reality').html(this.options.email);
        this.$('.js-emailTime').html(50);

        var emailTime = setInterval(function(){
            var num = $('.js-emailTime').html() - 1;
            if ($('.js-emailTime').html() == 0) {
                clearInterval(emailTime);
                self.$('.js-fd-finished').removeAttr("disabled");
            }else{
                $('.js-emailTime').html(num);
            }
        }, 1000)
        
    },

    nextHandler: function () {
        $('.js-acse-container').html(this.finish());
    },

    acseBackHandler:function () {
        
        var ContentEmailView12 = require('accountCenter/views/contentEmail');
        var conetent = new ContentEmailView12();
        $('.js-acse-container').html(conetent.render().el);
        this.destroy();
        
    }


});

module.exports = confirmEmailView;
