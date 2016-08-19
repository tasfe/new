"use strict";

var TabView = require('com/tabView');

var periodWay = require('bettingButler/views/periodWay');
var cycleWay = require('bettingButler/views/cycleWay');

var butlerSetPlan = TabView.extend({

    className: 'bb-butler-view menu-bock-butler',

    onRender: function() {
        this.initialize();
    },


    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '期数方式',
                    name: 'manual',
                    id: 'jsAcManualAccount',
                    view: periodWay
                },
                {
                    label: '周期方式',
                    name: 'auto',
                    id: 'jsAcAutoAccount',
                    view: cycleWay
                }
            ]
        });

    }


});

module.exports = butlerSetPlan;