"use strict";


var TicketSelectGroup = require('com/ticketSelectGroup');
var Timeset = require('com/timeset_single');


var PeriodWayView = Base.ItemView.extend({

    template: require('bettingButler/templates/periodWay.html'),
    dialog: _.template(require('bettingButler/templates/periodWayDialog.html')),
    events: {
        'click .js-newplan':'newPlan',
        'click .js-selete-text-content':'deletecontent',
        'click .js-hidden-dialog':'changeHrefHandler',
        'click .js-generate-plan':'generatePlanHandler',
        'click .js-span-athena-radioq ':'radioActive',
        'click .js-span-athena-Inp ':'InpActive',


    },
    InpActive:function (e) {
        var $target = $(e.currentTarget);
        $target.addClass('span-athena-Inp').siblings().removeClass('span-athena-Inp');
    },
    radioActive:function (e) {
        var $target = $(e.currentTarget);
        $target.addClass('span-athena-radio').siblings().removeClass('span-athena-radio');
    },



    initialize: function () {
    },

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

        new Timeset({
            el: $('.js-pf-timeset3'),
            startTime: 'regTimeStart',
            startOps: {
                format: 'YYYY-MM-DD'
            }
        }).render();
    }
});

module.exports = PeriodWayView;
