define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var BonusCardDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-bonusCardDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '加奖卡活动查看',
                columns: [
                    {
                        name: '领取时间',
                        width: '10%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '中奖金额',
                        width: '10%'
                    },
                    {
                        name: '比例',
                        width: '10%'
                    }
                    ,
                    {
                        name: '礼金',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                reqData: {
                    activityId:2,
                    type:4
                },
                ajaxOps: {
                    url: '/intra/activitymanage/packlist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-jj-timeset'),
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
            row.push(_(rowInfo.time).toTime());
            row.push(rowInfo.username);
            row.push(_(rowInfo.dataAmount).formatDiv(10000, {fixed: 2}));
            row.push(_(rowInfo.percent).formatDiv(100, {fixed: 2})+'%');
            row.push(_(rowInfo.result).formatDiv(10000, {fixed:4}));
            return row;
        }
    });
    module.exports = BonusCardDetailView;
});