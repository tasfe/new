define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var LotteryDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-lotteryDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '抽奖活动查看',
                columns: [
                    {
                        name: '抽奖时间',
                        width: '10%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '奖品',
                        width: '10%'
                    },
                    {
                        name: '提现金额',
                        width: '10%'
                    }
                    ,
                    {
                        name: '状态',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                reqData: {
                    activityId:1
                },
                ajaxOps: {
                    url: '/intra/activitymanage/rafflelist.json'
                }
            });
        },
        onRender: function () {
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
            row.push(_(rowInfo.result).formatDiv(10000, {fixed: 0})+'元');
            row.push(_(rowInfo.withdrawAmount).formatDiv(10000, {fixed: 2}));
            if(rowInfo.resultType==0){
                row.push("未抽奖");
            }
            if(rowInfo.resultType==1){
                row.push("已抽奖");
            }
            return row;
        }

    });
    module.exports = LotteryDetailView;
});