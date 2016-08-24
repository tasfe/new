"use strict";

var TabView = require('com/tabView');
var Timeset = require('com/timeset_single');
var TicketSelectGroup = require('com/ticketSelectGroup');
var cycleWayView = TabView.extend({
    template: require('bettingButler/templates/cycleWay.html'),
    events: {

    },
    initialize: function () {

    },
    onRender: function() {
        //初始化彩种选择
        new TicketSelectGroup({
            el: this.$('.js-uc-ticket-select-group')
        });
        //初始化时间
        new Timeset({
            el: this.$('.js-pf-timeset'),
            startTime: 'regTimeStart',
            startOps: {
                format: 'YYYY-MM-DD'
            }
        }).render();

    }

});

module.exports = cycleWayView;
