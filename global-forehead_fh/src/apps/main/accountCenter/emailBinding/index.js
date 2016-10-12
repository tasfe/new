"use strict";

var ContentEmailView = require('./contentEmail');

var verifyOldEmail = require('./verifyOldEmail');

var SettingEmail = Base.ItemView.extend({

    template: require('./index.html'),

    className: 'as-loginPwd-view',

    startOnLoading: true,
    
    events: {
        'click .js-modify-email': 'modifyEmailHandler'
    },

    initialize: function() {
        
    },

    onRender: function() {

        this.$hasEmail = false;

        this.$verifyEmail = this.$('.js-verify-email');
        this.$bindEmail = this.$('.js-bind-email');

        this.verifyHasEmail();
    },

    verifyHasEmail:function () {
        var self = this;
        Global.sync.ajax({
                url: '/acct/userinfo/userdetail.json'
            })
            .always(function() {
                self.loadingFinish();
            })
            .done(function(res) {
                var data = res.root || {};
                if (res && res.result === 0) {
                    if (data.userEmail ===null){

                        self.$hasEmail = false;
                        self.$bindEmail.addClass('ac-unbind-email');
                        var html = '未绑定邮箱 </br>请问是否需要 ' +
                            '<span class="js-modify-email as-launch-set text-hot" >绑定邮箱？</span>';
                        self.$verifyEmail.html(html);

                    }else {

                        self.$hasEmail = true;
                        self.$bindEmail.addClass('ac-binded-email');
                        self.$oldEmail = data.userEmail;
                        var html = '已绑定邮箱'+data.userEmail+' </br>请问您是否需要 ' +
                            '<span class="js-modify-email as-launch-set text-hot" >修改绑定邮箱？</span>';
                        self.$verifyEmail.html(html);

                    }
                }else {
                    Global.ui.notification.show('加载失败，请稍后再试');
                }

            });
    },

    modifyEmailHandler:function () {

        this.$dialog = Global.ui.dialog.show({
            title: '邮箱设置',
            size: 'modal-lg',
            body: '<div class="js-acse-container"></div>',
            bodyClass: 'ac-setemail-dialog'
        });

        if (this.$hasEmail===true){
            var verify = new verifyOldEmail({oldEmial:this.$oldEmail});
            this.$dialog.find('.js-acse-container').html(verify.render().el);
        }else {
            var conetent = new ContentEmailView();
            this.$dialog.find('.js-acse-container').html(conetent.render().el);
        }

        this.$dialog.on('hidden.modal', function () {
            $(this).remove();
        });

    }


});

module.exports = SettingEmail;