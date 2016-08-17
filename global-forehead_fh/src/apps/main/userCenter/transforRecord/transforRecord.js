var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var ProfitAndLoss = SearchGrid.extend({

    template: require('./index.html'),

    initialize: function () {
        _(this.options).extend({
            columns: [
                {
                    name: '交易流水号',
                    width: '22%'
                },
                {
                    name: '充值时间',
                    width: '20%'
                },
                {
                    name: '充值方式',
                    width: '14%'
                },
                {
                    name: '充值金额',
                    width: '15%',
                    sortable: true,
                    id: 0
                },
                {
                    name: '账户余额',
                    width: '15%',
                    sortable: true,
                    id: 1
                },
                {
                    name: '状态',
                    width: '14%'
                }
            ],
            gridOps: {
                emptyTip: '没有充值记录'
            },
            ajaxOps: {
                url: '/fund/recharge/rechargelist.json',
                abort: false
            },
            reqData: {
                subUser: 0
            },
            listProp: 'root.rechargeList',
            height: 315
        });
    },

    events: {
        'click .js-excess-cell': 'dateSelectHandler',
        'click .js-toggle-seach': 'toggleseachHandler'
    },
    dateSelectHandler:function (e) {
       this. $('.toggle-athena').removeClass('toggle-athena');
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

    onRender: function() {

        //初始化时间选择
        new Timeset({
            el: this.$('.js-pf-timeset'),
            startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
            endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
        }).render();

        // new Timeset({
        //     el: this.$('.js-pf-timeset'),
        //     startTime: 'regTimeStart',
        //     endTime: 'regTimeEnd',
        //     startTimeHolder: '起始日期',
        //     endTimeHolder: '结束日期',
        //     size: 'julien-time',
        //     prevClass: 'js-pf',
        //     startOps: {
        //         format: 'YYYY-MM-DD'
        //     },
        //     endOps: {
        //         format: 'YYYY-MM-DD'
        //     }
        // }).render();

        // var plArray=[{id:0,zhName:'单式直选'},{id:1,zhName:'直选和值'}];
        // this.$('select[name=payStatus]').html(_(plArray).map(function (qr) {
        //     return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
        // }).join(''));
        //
        // var plArray=[{id:0,zhName:'单式直选'},{id:1,zhName:'直选和值'}];
        // this.$('select[name=widthdrawStatus]').html(_(plArray).map(function (qr) {
        //     return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
        // }).join(''));

        if(this.options.reqData.username){
            this.$('input[name="username"]').val(this.options.reqData.username);
        }
        SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData) {
        var rowsData = _(gridData.rechargeList).map(function(info, index, list) {
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
            columnEls: [
                '<div class="text-hot">所有页总计</div>', '', '','',
                '<div class="text-hot">' + _(gridData.amountTotal).fixedConvert2yuan() + '</div>',
                '',''
            ]
        }).hideLoading();
    },

    formatRowData: function(rowInfo) {
        var row = [];
        row.push(rowInfo.userName);
        row.push(rowInfo.tradeNo);
        row.push(_(rowInfo.payTime).toTime());
        row.push(rowInfo.type);
        row.push(_(rowInfo.amount).fixedConvert2yuan());
        row.push(_(rowInfo.balance).fixedConvert2yuan());
        row.push(rowInfo.status);
        return row;
    }

});

module.exports = ProfitAndLoss;