define(function (require, exports, module) {
    require('prefab/views/tabView');

    var UserDetailView = require('userCenter/views/user-personalInfo');
    var UserBonusView = require('userCenter/views/user-userBonus');


    var ShowUserDetailView = Base.Prefab.TabView.extend({

        events: {

        },
        initialize: function () {
            var rightTag =_.getUrlParam('rightTag');
            var tabs = [];
            //可能是从总代管理功能的详情连接跳转
            if((Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.personalInfo)||(Global.authority.uc && Global.authority.uc.gm && Global.authority.uc.gm.personalInfo && rightTag==='1')){
                tabs.push({
                    label: '个人资料',
                    name: 'detail',
                    id: 'jsULConstantTab',
                    view: UserDetailView
                });
            }
            if((Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.bonusRebates) || (Global.authority.uc && Global.authority.uc.gm && Global.authority.uc.gm.bonusRebates && rightTag==='1') ){
                tabs.push({
                    label: '奖金返点',
                    name: 'bonus',
                    id: 'jsULBonusConstantTab',
                    view: UserBonusView
                });
            }
            _(this.options).extend({
                title: '用户信息查询',
                tabs: tabs
            });
        }

});

    module.exports = ShowUserDetailView;
});