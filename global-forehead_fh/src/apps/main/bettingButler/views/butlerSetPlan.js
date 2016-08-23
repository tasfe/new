"use strict";

var TabView = require('com/tabView');

var PeriodWayView = require('./periodWay');
var CycleWayView = require('./cycleWay');

var butlerSetPlan = TabView.extend({

    className: ' bb-butler-view menu-bock-butler',

    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '期数方式',
                    name: 'period',
                    id: 'jsPeriod',
                    view: PeriodWayView
                },
                {
                    label: '周期方式',
                    name: 'cycle',
                    id: 'jsCycle',
                    view: CycleWayView

                }
            ]
        });

    }

});

module.exports = butlerSetPlan;