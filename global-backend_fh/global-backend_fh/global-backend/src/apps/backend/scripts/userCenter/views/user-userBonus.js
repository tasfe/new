define(function (require, exports, module) {
    //声明一个view
    var UserBonusDetailsView = require('userCenter/views/user-userBonusDetails');

    var UserBonusView = Base.Prefab.TabView.extend({

        template: require('text!userCenter/templates/user-userBonus.html'),


        events: {

        },

        initialize: function () {
        },
        onRender: function(){
            var userName = _.getUrlParam('name');
            this.$('.js_ul_username').html(userName);


            //奖金详情：创建一个view,并添加在指定位置，传递指定参数
            new UserBonusDetailsView({
                el: this.$('.js-ul-bonusDetail'),
                userId: this._parentView.options.userId
            }).render();

        }
    });

    module.exports = UserBonusView;
});