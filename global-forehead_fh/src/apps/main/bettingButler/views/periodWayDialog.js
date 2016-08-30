"use strict";
var Timeset = require('com/timeset_single');
var PeriodWayView = Base.ItemView.extend({
    template: require('bettingButler/templates/periodWayDialog.html'),
    events: {
    },
    onRender: function() {
        //初始化时间
        new Timeset({
            el: this.$('.js-pf-timeset'),
            startTime: 'regTimeStart',
            startOps: {
                format: 'YYYY-MM-DD'
            }
        }).render();

    },
});

module.exports = PeriodWayView;
