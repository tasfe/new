"use strict";


var ConfirmView = require('accountCenter/views/setEmailConfirm');

var contentEmailView = Base.ItemView.extend({

    template: require('accountCenter/templates/contentEmail.html'),

    className: 'as-securityQuestion-view',

    startOnLoading: true,

    events: {

        'click .js-ac-next': 'nextHandler' //输入密保问题(与修改页面共用)

    },

    initialize: function () {


    },

    onRender: function () {

        this.loadingFinish();


    },

    nextHandler: function () {

        var confirm = new ConfirmView();

        $('.js-acse-container').html(confirm.render().el);
        
    }


});

module.exports = contentEmailView;
