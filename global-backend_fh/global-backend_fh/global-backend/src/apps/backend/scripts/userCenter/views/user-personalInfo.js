define(function (require, exports, module) {

    var ShowUserDetailView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-personalInfo.html'),


        events: {
            'click .js-ul-cardInfo':'cardInfoHandler'
        },
        initialize: function () {
        },

        onRender: function () {
            var self=this;
            var params = {userId: self._parentView.options.userId};
            this._loadPage(params, 'js-ul-loginDetail');

        },
        _loadPage: function (params, classValue) {
            var self = this;
            this._getLoginData(params).done(function (res) {
                if (res.result === 0) {
                    self.$('.js-ul-username').html(res.root.userInfo.userName);
                    self.$('.js-ul-userLevel').html('V'+res.root.userInfo.userLevel);
                    self.$('.js-ul-bankcard').html('<button data-id="' + res.root.userInfo.userId + '" data-type="' + res.root.userInfo.userName + '" class="js-ul-cardInfo btn  btn-info">银行卡信息</button>');
                    self.$('.js-ul-useruname').html(res.root.userInfo.uName);
                    self.$('.js-ul-integral').html(_(res.root.userInfo.integral).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ul-birth').html(res.root.userInfo.birthday);
                    self.$('.js-ul-balance').html(_(res.root.userInfo.balance).formatDiv(10000, {fixed: 4}) + '元');
                    self.$('.js-ul-tbalance').html(_(res.root.userInfo.tBalance).formatDiv(10000, {fixed: 4}) + '元');
                    self.$('.js-ul-useruname').html(res.root.userInfo.uName);
                    self.$('.js-ul-uday').html(res.root.userInfo.unActivityDays);
                    self.$('.js-ul-regtime').html(_(res.root.userInfo.userRegTime).toTime());
                    self.$('.js-ul-qq').html(res.root.userInfo.userQq);
                    self.$('.js-ul-email').html(res.root.userInfo.userEmail);
                    self._getTable(self._formatLoginData(res.root.loginList), classValue);
                }else{
                    Global.ui.notification.show(res.msg);
                }
            }).fail(function(){
            });
        },
        //发送请求
        _getLoginData: function (params) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getuserdetail.json',
                data: params
            });
        },
        //获取表格
        _getTable: function (tableInfo, classValue) {
        this.$('.' + classValue).staticGrid({
            colModel: [
                {label: '登录时间', name: 'loginTime',width: 100},
                {label: '设备', name: 'loginDevice', width: 120},
                {label: 'IP', name: 'loginIp', width: 130},
                {label: '地区', name: 'loginAddress', width: 130}
            ],
            row: tableInfo
        });
    },
        //格式化数据
        _formatLoginData: function (logins) {
            return _(logins).chain().map(function (login) {
                    return {
                        'loginTime': _(login.loginTime).toTime(),
                        'loginDevice': login.loginDevice,
                        'loginIp': login.loginIp,
                        'loginAddress': login.loginAddress
                    }}

            ).flatten().value();
        },
        cardInfoHandler:function(e){
            var $target = $(e.currentTarget);
            Global.appRouter.navigate(_('#fc/uc').addHrefArgs({
                _t:_.now(),
                username:$target.data('type')
            }), {trigger: true, replace: false});
        }
});

    module.exports = ShowUserDetailView;
});