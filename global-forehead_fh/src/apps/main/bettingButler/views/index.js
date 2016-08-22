"use strict";

var TicketSelectGroup = require('com/ticketSelectGroup');
var Timeset = require('com/timeset');

var ButlerSetPlan = require('bettingButler/views/butlerSetPlan');
var ButlerRunPlan = require('bettingButler/views/butlerRunPlan');
var ButlerColPlan = require('bettingButler/views/butlerColPlan');

var index = Base.ItemView.extend({

    template: require('bettingButler/templates/index.html'),

    events: {
        'click .js-list-active': 'activeChangeHandler'
    },

    initialize: function() {

    },
    activeChangeHandler:function (e) {

        this.$('.list-active').removeClass('list-active');
        var $target = $(e.currentTarget);
        $target.addClass('list-active');
        var currentIndex = $target.data('index');
        if (currentIndex==0){
            var butler = new ButlerSetPlan();
            this.$activeContext.html(butler.render().$el);
        }else if (currentIndex==1){
            var butler1 = new ButlerRunPlan();
            this.$activeContext.html(butler1.render().$el);
        }else if (currentIndex==2){
            var butler2 = new ButlerColPlan();
            this.$activeContext.html(butler2.render().$el);
        }


    },

    onRender: function() {
        var self = this;
        this.$activeContext = this.$('.js-active-context');

        var butler = new ButlerSetPlan();
        this.$activeContext.html(butler.render().$el);

        //初始化彩种选择
        new TicketSelectGroup({
            el: this.$('.js-uc-ticket-select-group')
        });

        //初始化时间选择
        new Timeset({
            el: this.$('.js-pf-timeset'),
            startTime: 'regTimeStart',
            //endTime: 'regTimeEnd',
            startTimeHolder: '起始日期',
            //endTimeHolder: '结束日期',
            size: 'julien-time',
            prevClass: 'js-pf',
            startOps: {
                format: 'YYYY-MM-DD'
            },
            //endOps: {
            //    format: 'YYYY-MM-DD'
            //}
        }).render();

    }


    



});

module.exports = index;