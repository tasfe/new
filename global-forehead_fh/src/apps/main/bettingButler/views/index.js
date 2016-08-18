"use strict";

var TabView = require('com/tabView');

var butlerSetPlan = require('bettingButler/views/butlerSetPlan');
var butlerRunPlan = require('bettingButler/views/butlerRunPlan');
var butlerColPlan = require('bettingButler/views/butlerColPlan');

var index = TabView.extend({



    className: 'ac-openAccount-view',

    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '设置计划',
                    name: 'manual',
                    id: 'jsAcManualAccount',
                    view: butlerSetPlan
                },
                {
                    label: '进行中的计划',
                    name: 'auto',
                    id: 'jsAcAutoAccount',
                    view: butlerRunPlan
                },
                {
                    label: '我的收藏方案',
                    name: 'auto',
                    id: 'jsAcAutoAccount',
                    view: butlerColPlan
                }
            ]
        });

    }


});

module.exports = index;