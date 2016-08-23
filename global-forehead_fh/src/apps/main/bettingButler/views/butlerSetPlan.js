"use strict";

var TabView = require('com/tabView');

var periodWay = require('bettingButler/views/periodWay');
var cycleWay = require('bettingButler/views/cycleWay');

var butlerSetPlan = TabView.extend({

    className: 'bb-butler-view menu-bock-butler',


    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '期数方式',
                    name: 'period',
                    id: 'jsPeriod',
                    view: periodWay
                },
                {
                    label: '周期方式',
                    name: 'cycle',
                    id: 'jsCycle',
                    view: cycleWay
                }
            ]
        });

    }


});

module.exports = butlerSetPlan;