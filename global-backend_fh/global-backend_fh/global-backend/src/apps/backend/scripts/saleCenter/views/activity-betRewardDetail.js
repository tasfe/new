define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var BetRewardTotalView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/activity-betRewardDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '投注奖励活动查看',
                columns: [
                    {
                        name: '活动时间',
                        width: '10%'
                    },
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '活动周期',
                        width: '6%'
                    }
                    ,
                    {
                        name: '投注金额',
                        width: '6%'
                    },
                    {
                        name: '奖励金额',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/activitymanage/betrewardlist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-br-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.dataList).map(function (dataInfo, index) {
                return {
                    columnEls: this.formatRowData(dataInfo, index),
                    dataAttr: dataInfo
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                    pageIndex: this.filterHelper.get('pageIndex'),
                    initPagination: true
                })
                .hideLoading();
        },
        formatRowData: function (rowInfo) {
            var row = [];
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.userName);
            row.push("第"+rowInfo.cycle+"天");
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.bonus).formatDiv(10000, {fixed: 4}));
            return row;
        }
    });
    module.exports = BetRewardTotalView;
});