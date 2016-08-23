"use strict";

var TabView = require('com/tabView');

var PeriodWayView = require('./periodWay');
var CycleWayView = require('./cycleWay');

var butlerSetPlan = TabView.extend({

    className: ' bb-butler-view menu-bock-butler',


    events: {
        'click .js-pf-tabView-item': 'activeChangeHandler1'
    },

    onRender: function() {
        //this.initialize();
        this.$activeContext = this.$('.js-active-context1');
    },


    initialize: function() {
        _(this.options).extend({
            tabs: [
                {
                    label: '期数方式',
                    name: 'manual',
                    id: 'jsAcManualAccount',
                    view: PeriodWayView
                },
                {
                    label: '周期方式',
                    name: 'auto',
                    id: 'jsAcAutoAccount',
                    view: CycleWayView
                }
            ]
        });

    },

    activeChangeHandler1:function (e) {

        var $target = $(e.currentTarget);

        var currentIndex = $target.data('index');
        if (currentIndex==0){
            var butler = new PeriodWayView();
            this.$activeContext.html(butler.render().$el);

            this.$('.js-active-context1').html(butler.render().$el);
        }
        if (currentIndex==1){
            var butler1 = new CycleWayView();
            this.$('.js-active-context1').html(butler1.render().$el);
        }

    },


});

module.exports = butlerSetPlan;