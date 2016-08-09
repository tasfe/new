define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var UserAddBonusTotalView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-userAddBonusTotal.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '限时加奖活动查看',
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
                        name: '中奖金额',
                        width: '6%'
                    }
                    ,
                    {
                        name: '加奖奖金',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                reqData: {
                    activityId:17
                },
                ajaxOps: {
                    url: '/intra/activitymanage/plusprizelist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-jjck-timeset'),
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
            });
            this.grid.addRows({
                columnEls: [
                    {
                        content: '<strong>奖金总计</strong>',
                        colspan: 3
                    },
                    _(gridData.bonusTotal).formatDiv(10000, {fixed: 4})
                ]
            })
                .hideLoading();
        },
        formatRowData: function (rowInfo) {
            var row = [];
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.userName);
            row.push(_(rowInfo.prize).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.bonus).formatDiv(10000, {fixed: 4}));
            return row;
        }

    });
    module.exports = UserAddBonusTotalView;
});