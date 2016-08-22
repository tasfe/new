"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var RechargeRecordsView = SearchGrid.extend({

    template: require('./index.html'),

    events: {
        'click .js-excess-cell': 'dateSelectHandler',
        'click .js-toggle-seach': 'toggleseachHandler'
    },
    dateSelectHandler:function (e) {
        this.$('.toggle-athena').removeClass('toggle-athena');
        $(e.currentTarget).addClass('toggle-athena');
        var recIndex = $(e.currentTarget).data('index');
        if (recIndex===1){
            this.$('.js-start-time').val(_(moment().add('days')).toDate()+' 0:00:00');
        }else if (recIndex===2){
            this.$('.js-start-time').val(_(moment().add('days',-3)).toDate()+' 0:00:00');
        }else if (recIndex===3){
            this.$('.js-start-time').val(_(moment().add('days',-7)).toDate()+' 0:00:00');
        }

    },
    toggleseachHandler:function () {
        if($('.js-toggle-seach').hasClass('on')) {
            $('.search-condition-table .row2').addClass('hidden');
            $('.js-toggle-seach').removeClass('on')
        } else{
            $('.search-condition-table .row2').removeClass('hidden');
            $('.js-toggle-seach').addClass('on')
        }
    },

    initialize: function () {
        _(this.options).extend({
            columns: [
                {
                    name: '账号',
                    width: '16%'
                },
                {
                    name: '充值',
                    width: '14%'
                },
                {
                    name: '提现',
                    width: '14%'
                },
                {
                    name: '投注',
                    width: '14%'
                },
                {
                    name: '中奖',
                    width: '14%',
                    sortable: true,
                    id: 0
                },
                {
                    name: '返点',
                    width: '14%',
                    sortable: true,
                    id: 1
                },
                {
                    name: '盈亏',
                    width: '14%'
                }
            ],
            gridOps: {
                emptyTip: '没有盈亏记录'
            },
            ajaxOps: {
                url: '/ticket/bethistory/agProfitLossReport.json',
                abort: false
            },
            //viewType: 'team',
            reqData: {
                subUser: 1
            },
            tip: '<div class="m-left-md m-top-md text-hot"><span>注意:</span> 盈亏记录只保留最近30天。</div>',
            listProp: 'root.data',
            height: 315
        });
    },

    onRender: function() {

        this.$('.js-pf-search-grid').addClass('bc-report-table');

        //初始化时间选择
        new Timeset({
            el: this.$('.js-pf-timeset'),
            startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
            endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
        }).render();
        if(this.options.reqData.username){
            this.$('input[name="username"]').val(this.options.reqData.username);
        }

        // //初始化时间选择
        // new Timeset({
        //     el: this.$('.js-pf-timeset'),
        //     startDefaultDate:_(moment().add('days')).toDate(),
        //     endDefaultDate: _(moment().add('days')).toDate()
        // }).render();
        //
        SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData) {
        var rowsData = _(gridData.data).map(function(info, index, list) {
            return {
                columnEls: this.formatRowData(info, index, list),
                dataAttr: info
            };
        }, this);

        this.grid.refreshRowData(rowsData, gridData.rowCount, {
            pageIndex: this.filterHelper.get('pageIndex'),
            initPagination: true
        });

        //加上统计行
        this.grid.addFooterRows({
                //trClass: 'tr-footer',
                columnEls: [
                    '<div class="text-hot">所有页总计</div>',
                    '<div class="text-hot">' + gridData.rechargeTotal + '</div>',
                    '<div class="text-hot">' + gridData.withdrawTotal + '</div>',
                    '<div class="text-hot">' + gridData.betTotal + '</div>',
                    '<div class="text-hot">' + gridData.prizeTotal + '</div>',
                    '<div class="text-hot">' + gridData.rebateTotal + '</div>',
                    '<div class="text-hot">' + gridData.profitLossTotal + '</div>'
                ]
            })
            .hideLoading();
    },

    formatRowData: function(rowInfo) {
        var row = [];
        row.push(rowInfo.userAccount);
        row.push(rowInfo.rechargeTotal);
        row.push(rowInfo.withdrawTotal);
        row.push(rowInfo.betTotal);
        row.push(rowInfo.prizeTotal);
        row.push(rowInfo.rebateTotal);
        row.push(rowInfo.profitLossTotal);
        return row;
    }
});

module.exports = RechargeRecordsView;
