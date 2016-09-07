define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var AgentRewardDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-agentWageDetail.html'),

        events: {
        },

        initialize: function () {
            _(this.options).extend({
                title: '代理工资活动查看',
                columns: [
                    {
                        name: '日期',
                        width: '10%'
                    },
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '消费金额',
                        width: '6%'
                    }
                    ,
                    {
                        name: '亏损金额',
                        width: '6%'
                    },
                    {
                        name: '获得工资',
                        width: '6%'
                    },
                    {
                        name: '活跃用户',
                        width: '6%'
                    },
                    {
                        name: '领取状态',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/agentWages/wagesdetail.json '
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-wd-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.detailList).map(function (dataInfo, index) {
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
            row.push(_(rowInfo.wagesDate).toTime());
            row.push(rowInfo.userName);
            row.push(_(rowInfo.betTotal).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.profitTotal).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.wageAmount).formatDiv(10000, {fixed: 4}));
            row.push(rowInfo.validUser);
            if(rowInfo.getStatus==0){
                row.push("未领取");
            }
            if(rowInfo.getStatus==1){
                row.push("已领取");
            }
            return row;
        }

    });
    module.exports = AgentRewardDetailView;
});