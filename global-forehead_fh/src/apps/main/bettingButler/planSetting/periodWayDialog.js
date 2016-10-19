"use strict";
var Timeset = require('com/timeset_single');
var PeriodWayView = Base.ItemView.extend({
    template: require('bettingButler/templates/periodWayDialog.html'),
    events: {
    },
    initialize: function () {
        alert(2);
    },
    onRender: function() {
        alert(1);
        //初始化时间
        new Timeset({
            el: this.$('.js-pf-timeset3'),
            startTime: 'regTimeStart',
            startOps: {
                format: 'YYYY-MM-DD'
            }
        }).render();

    }
});

module.exports = PeriodWayView;
