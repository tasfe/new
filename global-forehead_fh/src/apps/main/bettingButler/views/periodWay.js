"use strict";


var TicketSelectGroup = require('com/ticketSelectGroup');
var Timeset = require('com/timeset_single');


var PeriodWayView = Base.ItemView.extend({

    template: require('bettingButler/templates/periodWay.html'),
    dialog: _.template(require('bettingButler/templates/periodWayDialog.html')),
    events: {
        'click .js-newplan':'newPlan',
        'click.js-selete-text-content':'deletecontent',
        'click.js-hidden-dialog':'changeHrefHandler',
        'click.js-generate-plan':'generatePlanHandler',
        'click.js-span-athena-radio':'radioActive'
    },
    radioActive:function(){
        $('.js-span-athena-radio').click(function(){
          $(this).removeClass('.span-athena-radio-hiiHHHddHen').addClass('.span-athena-radio');
        })
    },

    initialize: function () {
    },

    /*

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

    */

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


    },
    newPlan:function () {
        var $dialog = Global.ui.dialog.show({
            title:'提示',
            size: 'modal-lg',
            body: '<div  style="background-color: #fff;" class="js-pw-container"></div>',
            bodyClass: 'ac-periodWay-dialog'
        });

        $dialog.find('.ac-periodWay-dialog').removeClass('modal-body');
        $dialog.find('.js-pw-container').html(this.dialog());
        $dialog.on('hidden.modal', function () {
            $(this).remove();
        });

    }
    
    
    
    
    
    
    
    
});

module.exports = PeriodWayView;
