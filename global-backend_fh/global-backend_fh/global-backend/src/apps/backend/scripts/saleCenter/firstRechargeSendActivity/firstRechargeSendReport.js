define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var FirstRechargeSendReportView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/firstRechargeSendActivity/firstRechargeSendReport.html'),

        events: {
        },

        initialize: function () {

            _(this.options).extend({
                title: '首冲送活动记录',
                columns: [
                    {
                        name: '领取时间',
                        width: '18%'
                    },
                    {
                        name: '用户名',
                        width: '12%'
                    },
                    {
                        name: '所属上级',
                        width: '12%'
                    },
                    {
                        name: '注册时间',
                        width: '12%'
                    },
                    {
                        name: '领取IP地址',
                        width: '12%'
                    },
                    {
                        name: '首次充值金额',
                        width: '12%'
                    },
                    {
                        name: '领取金额',
                        width: '12%'
                    },
                    {
                        name: '流水金额',
                        width: '12%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/newrechact/list.json'
                },
                pagination: true
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-rpg-report-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                //startFormat: 'YYYY-MM-DD',
                //endFormat: 'YYYY-MM-DD',
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
            //加上统计行
            this.grid.addRows({
                columnEls: [
                    '<strong>总计</strong>',
                    {
                        colspan: 4
                    },
                    _(gridData.rechargeTotal).convert2yuan(),
                    _(gridData.amountTotal).convert2yuan(),
                    _(gridData.betTotal).convert2yuan()
                ]
            })
                .hideLoading();
        },
        formatRowData: function (rowInfo) {
            var row = [];
            row.push(_(rowInfo.createTime).formatTime());
            row.push(rowInfo.userName);
            row.push(rowInfo.parentUserName);
            row.push(_(rowInfo.userRegTime).formatTime());
            row.push(rowInfo.ip);
            row.push(_(rowInfo.recharge).formatDiv(10000));
            row.push(_(rowInfo.amount).formatDiv(10000));
            row.push(_(rowInfo.bet).formatDiv(10000));
            return row;
        }

    });
    module.exports = FirstRechargeSendReportView;
});