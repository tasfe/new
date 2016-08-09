define(function (require, exports, module) {
    require('prefab/views/tabView');

    var NewNoticeGroupsView = require('messageCenter/views/notice-NewNoticeGroups');
    var NewNoticeUsersView = require('messageCenter/views/notice-NewNoticeUsers');
    var NewNoticeLevelsView = require('messageCenter/views/notice-NewNoticeLevels');
    var NewNoticeView = Base.Prefab.TabView.extend({
        initialize: function() {
            _(this.options).extend({
                tabs: [
                    //{
                    //    label: '用户组',
                    //    name: 'Groups',
                    //    id: 'jsSPGroups',
                    //    view: NewNoticeGroupsView
                    //},
                    {
                        label: '用户级别',
                        name: 'Levels',
                        id: 'jsSPLevels',
                        view: NewNoticeLevelsView
                    },
                    {
                        label: '用户名',
                        name: 'Users',
                        id: 'jsSpUsers',
                        view: NewNoticeUsersView
                    }
                ]
            });
        },

        renderLimit: function($limit) {
            var self = this;

        }

    });

    module.exports = NewNoticeView;
});