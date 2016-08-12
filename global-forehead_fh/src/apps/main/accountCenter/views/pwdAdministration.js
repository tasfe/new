"use strict";


var loginPwdView = require('accountCenter/views/passwordManage-loginPwd');
var fundPwdView = require('accountCenter/views/passwordManage-fundPwd');
var findPwdView = require('accountCenter/views/passwordManage-findPwd');

var pwdAdministration = Base.ItemView.extend({

    template: require('accountCenter/templates/pwdAdministration.html'),

    //构造通过安全问题找回资金密码页面
    bySQTpl: _.template(require('accountCenter/templates/passwordManage-bySQ.html')),
    
    //构造通过银行卡信息找回资金密码页面
    byCITpl: _.template(require('accountCenter/templates/passwordManage-byCI.html')),

    events: {
        //选择找回资金密码的方式
        'click .js-ad-mvlped': 'modifylpwdHandler',
        'click .js-ad-mvmpwd': 'modifympwdHandler',
        'click .js-ac-rempwd': 'findmpwdHandler'
    },


    //渲染时绑定事件、创建的对象、执行初始化
    onRender: function() {
        
        // var self = this;
        //
        // this.$selectWay = this.$('.js-ac-selectWay');
        // this.$validate = this.$('.js-ac-validate');

    },

    modifylpwdHandler:function () {

        var withdrawView = new loginPwdView();
        this.$dialogWd = Global.ui.dialog.show({
            id: _.now(),
            title: '修改登录密码',
            size: 'modal-lg',
            body:  '<div class="js-fc-wd-container"></div>'
        });

        this.$dialogWd.find('.modal-body').addClass('fc-wd-bg');
        this.$dialogWd.find('.fc-wd-bg').removeClass('modal-body');

        this.$dialogWd.find('.js-fc-wd-container').html(withdrawView.render().el);

        this.$dialogWd.on('hidden.modal', function () {
            $(this).remove();
        });

        
    },

    modifympwdHandler:function () {

    },

    findmpwdHandler:function () {

    }



});

module.exports = pwdAdministration;
