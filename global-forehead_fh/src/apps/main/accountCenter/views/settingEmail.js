"use strict";

var ContentEmailView = require('accountCenter/views/contentEmail');

var SettingEmail = Base.ItemView.extend({

    template: require('accountCenter/templates/settingEmail.html'),

    className: 'as-loginPwd-view',
    
    events: {
        'click .js-modify-email': 'modifyEmailHandler'
    },

    initialize: function() {
        
    },

    onRender: function() {
        
    },

    modifyEmailHandler:function () {
        //{parentView: this}
        var conetent = new ContentEmailView();

        this.$dialog = Global.ui.dialog.show({
            title: '邮箱设置',
            size: 'modal-lg',
            body: '<div class="js-acse-container"></div>',
            bodyClass: 'ac-setemail-dialog'
        });
        
        this.$dialog.find('.js-acse-container').html(conetent.render().el);

        this.$dialog.on('hidden.modal', function () {
            $(this).remove();
        });
        
                     
    }


});

module.exports = SettingEmail;