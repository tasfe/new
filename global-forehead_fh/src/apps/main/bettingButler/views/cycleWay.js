"use strict";

var TabView = require('com/tabView');
var Timeset = require('com/timeset_single');
var TicketSelectGroup = require('com/ticketSelectGroup');
var cycleWayView = TabView.extend({
    template: require('bettingButler/templates/cycleWay.html'),
    dialog: _.template(require('bettingButler/templates/cycledialog.html')),
    events: {
        'click .js-span-athena-radioq ':'radioActive',
        'click .js-span-athena-Inp ':'InpActive',
        'click .js-auto-stage ':'autoStage'
    },
    InpActive:function (e) {
        var $target = $(e.currentTarget);
        $target.addClass('span-athena-Inp').siblings().removeClass('span-athena-Inp');
    },
    autoStage:function () {
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

    }

});

module.exports = cycleWayView;
