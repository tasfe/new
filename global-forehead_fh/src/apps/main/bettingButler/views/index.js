"use strict";

var TicketSelectGroup = require('com/ticketSelectGroup');
var Timeset = require('com/timeset_single');
var ButlerSetPlan = require('bettingButler/views/butlerSetPlan');
var ButlerRunPlan = require('bettingButler/views/butlerRunPlan');
var ButlerColPlan = require('bettingButler/views/butlerColPlan');

var index = Base.ItemView.extend({

    template: require('bettingButler/templates/index.html'),

    events: {
        'click .js-list-active': 'activeChangeHandler',
        'click .js-newplan':'newPlan',
        'click.js-selete-text-content':'deletecontent',
        'click.js-hidden-dialog':'changeHrefHandler',
    },
    changeHrefHandler: function(e) {
       $('.js-hidden-dialog').click(function(){
          $('.js-alert-background-dialog').hide(1000);
       })
    },
    deletecontent:function(){
        $('.js-selete-text-content').click(function(){
                $(this).parent().remove();
        })
    },
    newPlan:function(){
        console.log($('.js-pf-timeset').val())
        $('.js-plan-time').html($('.js-pf-timeset').val());
        $('.js-cycle-btn').click(function(){
            $('.js-alert-new ').removeClass('active-display');

           // alert(1);
        });
        //新建计划的内容.active-display
        $('.js-newplan').click(function(){
            $('.js-alert-background-dialog').hide(1000);
            $('.js-hidden').click(function(){
                $('.js-alert-new ').removeClass('active-display');
            })
        })
    },
    getRuleXhr: function() {
        return Global.sync.ajax({
            url: '/fund/redenvelope/info.json'
        });
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

        ////获取数据
        //this.getRuleXhr()
        //    .done(function(res) {
        //        var data;
        //        if (res && res.result === 0) {
        //            data = res.root || {};
        //            $.each(function(i,data){
        //                self.$('.js-reward-grid').html('<tr><td>+data.+</tr>');
        //            })
        //
        //
        //        }
        //    });


        //初始化彩种选择
        new TicketSelectGroup({
            el: this.$('.js-uc-ticket-select-group')
        });
//初始化时间

        //new Timeset({
        //    el: this.$('.js-pf-timeset'),
        //    startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
        //    endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
        //}).render();

        new Timeset({
            el: this.$('.js-pf-timeset'),
            startTime: 'regTimeStart',
            startOps: {
                format: 'YYYY-MM-DD'
            }
        }).render();

    }


    



});
//new Timeset({
//    el: this.$('.js-pf-timeset'),
//    startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
//    endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
//}).render();
module.exports = index;