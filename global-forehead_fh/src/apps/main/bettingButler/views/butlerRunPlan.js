"use strict";
var TabView = require('com/tabView');
var RuningPlanView = require('./runingPlan');
var OverPlan = require('./overPlan');
var butlerRunPlan = TabView.extend({
     className: ' bb-butler-view menu-bock-butler  active-container-header-btn julien-bb-sp no-tips-julien',
    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '进行中',
                    name: 'running',
                    id: 'jsRunning',
                    view: RuningPlanView,

                },
                {
                    label: '已结束',
                    name: 'over',
                    id: 'jsOver',
                    view: OverPlan
                }
            ]
        });
    }


});

module.exports = butlerRunPlan;