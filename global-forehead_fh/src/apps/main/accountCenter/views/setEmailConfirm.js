"use strict";

var ContentEmailView = require('accountCenter/views/contentEmail');

var confirmEmailView = Base.ItemView.extend({

    template: require('accountCenter/templates/setEmailConfirm.html'),

    finish: _.template(require('accountCenter/templates/setEmailFinished.html')),

    className: 'as-securityQuestion-view',

    startOnLoading: true,



    events: {

        'click .js-fd-finishedt': 'nextHandler', //输入密保问题(与修改页面共用)
        'click .js-acse-back': 'acseBackHandler'

    },

    initialize: function () {


    },

    onRender: function () {

        this.loadingFinish();


    },

    nextHandler: function () {

        $('.js-acse-container').html(this.finish());

    },

    acseBackHandler:function () {
        alert(111);
        var conetent = new ContentEmailView({parentView: this.parentView});
        $('.js-acse-container').html(conetent.render().el);
    }


});

module.exports = confirmEmailView;
