"use strict";

var TabView = require('com/tabView');
var Timeset = require('com/timeset_single');
var TicketSelectGroup = require('com/ticketSelectGroup');
var cycleWayView = TabView.extend({
    template: require('bettingButler/templates/cycleWay.html'),
    events: {
        'click .js-span-athena-radioq ':'radioActive',
        'click .js-span-athena-Inp ':'InpActive'
    },
    InpActive:function (e) {
        var $target = $(e.currentTarget);
        $target.addClass('span-athena-Inp').siblings().removeClass('span-athena-Inp');
    },
    radioActive:function (e) {
        var $target = $(e.currentTarget);
        $target.addClass('span-athena-radio').siblings().removeClass('span-athena-radio');
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
