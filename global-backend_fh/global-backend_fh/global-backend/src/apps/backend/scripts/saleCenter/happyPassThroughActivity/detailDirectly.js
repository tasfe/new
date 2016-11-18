define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var DetailDirectlyView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/happyPassThroughActivity/detailDirectly.html'),

        events: {

        },
        initialize: function () {
            _(this.options).extend({
                title: '欢乐大闯关活动查看直属',
                columns: [
                    {
                        name: '日期',
                        width: '15%'
                    },
                    {
                        name: '直属用户名',
                        width: '14%'
                    },
                    {
                        name: '下级通关数量',
                        width: '14%'
                    },
                    {
                        name: '奖金',
                        width: '14%'
                    },
                    {
                        name: '备注',
                        width: '14%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },reqData: {
                    activityId:40
                },
                ajaxOps: {
                    url: '/intra/activitymanage/happystagesuperlist.json'
                }
            });
        },

        onRender: function () {
            var self = this;
            //初始化时间选择
            this.timeset = new Global.Prefab.Timeset({
                el: this.$('.js-hp-detailD-timeset'),
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

            this.grid.refreshRowData(rowsData, gridData.total.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            })
                .hideLoading();
            this.grid.addRows({
                columnEls: [
                    '<strong>所有页总计</strong>',
                    {
                        colspan: 1
                    },
                    gridData.total.lowerTotal,
                    _.formatDiv(gridData.total.bonusTotal,10000),
                    {
                        colspan: 1
                    }
                ]
            })
                .hideLoading();
        },
        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.date);
            row.push(rowInfo.superName);
            row.push(rowInfo.lowerCount);
            row.push(_.formatDiv(rowInfo.bonus,10000));
            row.push(rowInfo.remark);
            return row;
        }


    });

    module.exports = DetailDirectlyView;
});