define(function (require, exports, module) {
    require('prefab/views/searchGrid');

    var bonusTypeConfig = require('./bonusType');

    var RedDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!./throw.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                bonusType: bonusTypeConfig.getAllBonus(),
                columns: [
                    {
                        name: '时间',
                        width: '10%'
                    },
                    {
                        name: '发放人',
                        width: '10%'
                    },
                    {
                        name: '发放金额',
                        width: '10%'
                    },
                    {
                        name: '拾取类型',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },reqData: {
                    activityId: 12
                },
                ajaxOps: {
                    url: '/intra/activitymanage/bottlegiveoutlist.json'
                }
            });
        },
        onRender: function() {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-hk-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function(gridData) {
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
            row.push(_(rowInfo.time).toTime());
            row.push(rowInfo.username);
            row.push(_(rowInfo.result).convert2yuan());
            row.push(bonusTypeConfig.getBonusById(Number(rowInfo.resultType)).name);
            return row;
        }

    });
    module.exports = RedDetailView;
});