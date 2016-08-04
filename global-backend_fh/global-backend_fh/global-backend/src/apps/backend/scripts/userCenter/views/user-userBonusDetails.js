define(function (require, exports, module) {
    require('prefab/views/tabView');

    var UserBonusDetailsView = Base.Prefab.TabView.extend({


        events: {},

        initialize: function () {
            _(this.options).extend({
                tabs: [
                    {
                        label: '时时彩',
                        name: 'constant',
                        id: 'jsULSSCConstantTab',
                        template: '<div class="js-ul-constContainer"><div class="js-ul-constNotice"></div><div class="js-ul-constGrid"></div></div>'
                    },
                    {
                        label: '十一选五',
                        name: 'elev',
                        id: 'jsUlElevenSelectFiveTab',
                        template: '<div class="js-ul-ElevContainer"><div class="js-ul-ElevNotice"></div><div class="js-ul-ElevGrid"></div></div>'
                    },
                    {
                        label: '低频彩',
                        name: 'low',
                        id: 'jsUlLowFrequentTab',
                        template: '<div class="js-ul-lowContainer"><div class="js-ul-lowNotice"></div><div class="js-ul-lowGrid"></div></div>'
                    }
                ]
            });

            //未传递此参数时使用当前用户的id,分别用于个人中心及代理中心的奖金详情查询
            _(this.options).defaults({
               // userId: Global.memoryCache.get('acctInfo').userId
            });
        },

        onConstantRender: function () {
            var self = this;
            var params = {ticketSeriesId: 1, userId: self.options.userId};
            this._loadPage(params, 'js-ul-constGrid');
        },
        onElevRender: function () {
            var self = this;
            var params = {ticketSeriesId: 2, userId: self.options.userId};
            this._loadPage(params, 'js-ul-ElevGrid');

        },
        onLowRender: function () {
            var self = this;
            var params = {ticketSeriesId: 3, userId: self.options.userId};
            this._loadPage(params, 'js-ul-lowGrid');
        },
        _loadPage: function (params, classValue) {
            var self = this;
            this._getBonusData(params).done(function (res) {
                if (res.result === 0) {
                    self._getTable(self._formatNewGroups(self._formatLevelData(res.root.playBonusList.levels)), classValue);
                }else{
                    Global.ui.notification.show(res.msg);
                }
            }).fail(function(){
            });
        },
        //发送请求
        _getBonusData: function (params) {
            return Global.sync.ajax({
                url: '/intra/usermanager/userticketbonus.json',
                data: params
            });
        },
        //获取表格
        _getTable: function (tableInfo, classValue) {
            this.$('.' + classValue).staticGrid({
                colModel: [
                    {label: '玩法群', name: 'playLevel', merge: true, width: 100},
                    {label: '玩法组', name: 'playGroup', merge: true, width: 120},
                    {label: '玩法', name: 'playName', width: 130},
                    {label: '最低奖金（元模式）', name: 'bonusMin', width: 130},
                    {label: '返点', name: 'rebate', width: 120},
                    {label: '最高奖金（元模式）', name: 'bonusMax', width: 120}
                ],
                row: tableInfo
            });
        },
        //格式化数据
        _formatLevelData: function (levels) {
            return _(levels).chain().map(function (level) {
                var playLevel = level.ticketLevelName;
                var groups = level.groups;
                return _(groups).map(function (group) {
                    var playGroup = group.ticketGroupName;
                    return {
                        'playLevel': playLevel,
                        'playGroup': playGroup,
                        'plays': group.plays
                    };
                });
            }).flatten().value();
        },

        _formatNewGroups: function (groups) {
            return _(groups).chain().map(function (group) {
                return _(group.plays).map(function (play) {
                    return {
                        'playLevel': group.playLevel,
                        'playGroup': group.playGroup,
                        'playName': play.ticketPlayName,
                        'bonusMin': '￥' + _(play.ticketPlayBonus).formatDiv(10000, {fixed: 4}),
                        'rebate': _(play.userRebate).formatDiv(10) + '%',
                        'bonusMax': '￥' + _(play.ticketPlayMaxBonus).formatDiv(10000, {fixed: 4})
                    };
                });
            }).flatten().value();
        }

    });

    module.exports = UserBonusDetailsView;
});