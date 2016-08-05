define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var PlayProfitAndLossReportView = Base.Prefab.SearchGrid.extend({

        template: require('text!dataCenter/templates/playProfitAndLossReport.html'),

        events: {},
        initialize: function () {

            _(this.options).extend({
                title: '玩法盈亏报表',
                columns: [
                    {
                        name: '玩法群',
                        width: '6%'
                    },
                    {
                        name: '玩法组',
                        width: '6%'
                    },
                    {
                        name: '玩法',
                        width: '6%'
                    },
                    {
                        name: '销售总额',
                        width: '6%'
                    },
                    {
                        name: '中奖总额',
                        width: '6%'
                    },
                    {
                        name: '返点总额',
                        width: '6%'
                    },
                    {
                        name: '盈亏',
                        width: '6%'
                    }
                ],
                pagination: false,
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/sysreport/ticketplayreport.json'
                }
            });
        },
        onRender: function () {
            var self=this;
            //var param = {ticketName: self._parentView.options.name,plan:self._parentView.options.plan,day:self._parentView.options.day};
            self.$('.js-lt-ticketName').html('<label class="control-label m-right-sm">&nbsp;&nbsp;&nbsp;'+_.getUrlParam('name')+'</label>');
            self.$('.js-lt-play-ticketName').html('<label class="control-label m-right-sm">日期：</label><label class="control-label m-right-sm">'+_.getUrlParam('name')+'</label>');
            self.$('.js-lt-play-ticketPlanId').html('<label class="control-label m-right-sm">彩种名称：</label><label class="control-label m-right-sm">'+_.getUrlParam('plan')+'</label>');
            self.$('.js-lt-play-time').html('<label class="control-label m-right-sm">期号：</label><label class="control-label m-right-sm">'+_.getUrlParam('day')+'</label>');
            self.$('input[name=ticketId]').val(_.getUrlParam('id'));
            self.$('input[name=ticketPlanId]').val(_.getUrlParam('plan'));
            self.$('input[name=day]').val(_.getUrlParam('day'));
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.amountList).map(function (amount, index) {
                return {
                    columnEls: this.formatRowData(amount, index),
                    dataAttr: amount
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            });
            //加上统计行
            this.grid.addRows({
                columnEls: [
                    '<strong>总结</strong>',
                    {
                        colspan: 2
                    },
                    _(gridData.betTotal).fixedConvert2yuan(),
                    _(gridData.prizeTotal).convert2yuan(),
                    _(gridData.bonusTotal).convert2yuan(),
                    _(gridData.betTotal-gridData.prizeTotal-gridData.bonusTotal).convert2yuan()
                ]
            })
                .hideLoading();

        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.ticketLevelName);
            row.push(rowInfo.ticketGroupName);
            row.push(rowInfo.ticketPlayName);
            row.push(_(rowInfo.bet).formatDiv(10000,{fixed:2}));
            row.push(_(rowInfo.prize).formatDiv(10000,{fixed:4}));
            row.push(_(rowInfo.bonus).formatDiv(10000,{fixed:4}));
            row.push(_(rowInfo.bet-rowInfo.prize-rowInfo.bonus).formatDiv(10000,{fixed:4}));
            return row;
        }
    });

    module.exports = PlayProfitAndLossReportView;
});
//56250