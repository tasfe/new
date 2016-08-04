define(function (require, exports, module) {
    require('prefab/views/tabView');

    var NewBulletinUrgentView = require('messageCenter/views/bulletin-NewBulletinUrgent');
    var NewBulletinGeneralView = require('messageCenter/views/bulletin-NewBulletinGeneral');
    var NewBulletinView = Base.Prefab.TabView.extend({
        initialize: function() {
            var tabs = [];
            if(Global.authority.mc && Global.authority.mc.cn && Global.authority.mc.cn.common){
                tabs.push({
                    label: '普通公告',
                    name: 'general',
                    id: 'jsMcGeneral',
                    view: NewBulletinGeneralView
                });
            }
            if(Global.authority.mc && Global.authority.mc.cn && Global.authority.mc.cn.urgent){
                tabs.push({
                    label: '紧急公告',
                    name: 'urgent',
                    id: 'jsMcUrgent',
                    view: NewBulletinUrgentView
                });
            }
            _(this.options).extend({
                tabs: tabs
            });
        },

        renderLimit: function($limit) {
            var self = this;

        }

    });

    module.exports = NewBulletinView;
});