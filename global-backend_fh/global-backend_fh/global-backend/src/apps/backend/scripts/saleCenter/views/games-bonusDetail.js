define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var BonusDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-bonusDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '加奖活动查看',
                columns: [
                    {
                        name: '结算日期',
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
                ],
                gridOps: {
                    emptyTip: '无记录'
                },reqData: {
                    activityId:4
                },
                ajaxOps: {
                    url: '/intra/activitymanage/rebatelist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-jk-timeset'),
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
            row.push(_(rowInfo.result).formatDiv(10000, {fixed: 4}));
            if(rowInfo.status==0){
                row.push("未领取");
            }
            if(rowInfo.status==1){
                row.push("已领取");
            }
             return row;
        }

    });
    module.exports = BonusDetailView;
});