define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var GiftPacksTotalView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/activity-giftPacksDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '新手礼包活动查看',
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
                        name: '奖励类型',
                        width: '6%'
                    }
                    ,
                    {
                        name: '充/投/提金额',
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
                    url: '/intra/activitymanage/giftpackslist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-gp-timeset'),
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
            var type = "首充奖励";
            if(rowInfo.packType == 1 ){
                type = "首充奖励";
            }else if(rowInfo.packType == 2){
                type = "首投奖励";
            }else if(rowInfo.packType == 3){
                type = "首次提现";
            }
            var row = [];
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.userName);
            row.push(type);
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.bonus).formatDiv(10000, {fixed: 4}));
            return row;
        }

    });
    module.exports = GiftPacksTotalView;
});