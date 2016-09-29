/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var AgRechargeReportView = Base.Prefab.SearchGrid.extend({

        template: require('text!agGame/amountManagement/ag-rechargeReport.html'),

        events: {},
        initialize: function () {
            _(this.options).extend({
                title: 'AG转账记录',
                columns: [
                    {
                        name: '交易流水号',
                        width: '10%'
                    },
                    {
                        name: 'AG账号',
                        width: '10%'
                    },
                    {
                        name: '转账时间',
                        width: '10%'
                    },
                    {
                        name: '交易类型',
                        width: '10%'
                    },
                    {
                        name: '收入',
                        width: '10%'
                    },
                    {
                        name: '支出',
                        width: '10%'
                    },
                    {
                        name: '余额',
                        width: '10%'
                    },
                    {
                        name: '转账状态',
                        width: '10%'
                    },
                    {
                        name: '备注',
                        width: '20%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/agmanager/agtransferlist.json'
                },
                exportOps: {
                    url: '/intra/betmng/download'
                }
            });
        },

        onRender: function () {
            //初始化时间选择
            this.timeset = new Global.Prefab.Timeset({
                el: this.$('.js-ag-recharge-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                showToday: true
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },


        renderGrid: function (gridData) {
            var self = this;
            var rowsData = _(gridData.betList).map(function (order, index) {
                return {
                    columnEls: this.formatRowData(order, index),
                    dataAttr: order
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            });

            this.grid.addRows({
                columnEls: [
                    '<strong>本页小结</strong>',
                    {
                        colspan: 3
                    },
                    _(gridData.inComeTotal).fixedConvert2yuan(),
                    _(gridData.speedTotal).convert2yuan(),
                    {
                        colspan: 3
                    }
                ]
            })
                .hideLoading();
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.billNo);
            row.push(rowInfo.userName);
            row.push(_(rowInfo.createTime).toTime());
            if(rowInfo.tradeType==110){
                row.push("转入AG");
                row.push(_(rowInfo.amount).fixedConvert2yuan());
                row.push("/");
            }else{
                row.push("转出AG");
                row.push("/");
                row.push(_(rowInfo.amount).fixedConvert2yuan());
            }
            row.push(_(rowInfo.balance).fixedConvert2yuan());
            if(rowInfo.tradeType==0){
                row.push("转账成功");
            }else{
                row.push("转账失败");
            }
            row.push(rowInfo.remark);

            return row;
        }

    });

    module.exports = AgRechargeReportView;
});
