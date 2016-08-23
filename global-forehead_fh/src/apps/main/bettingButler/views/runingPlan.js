"use strict";


var TabView = require('com/tabView');

var RuningPlanView = TabView.extend({

    template: require('bettingButler/templates/runningPlan.html'),

    events: {

    },

    initialize: function () {
        alert('sdfds');
    },
    onRender: function() {
        initialize();
    }

   
    
});

module.exports = RuningPlanView;
