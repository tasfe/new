/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var AgBetRecordView = Base.Prefab.SearchGrid.extend({

        template: require('text!agGame/betManagement/ag-BettingRecord.html'),

        events: {},

        initialize: function () {
            _(this.options).extend({
                title: 'AG投注记录',
                columns: [
                    {
                        name: '订单编号',
                        width: '10%'
                    },
                    {
                        name: 'AG用户名',
                        width: '8%'
                    },
                    {
                        name: '平台类型',
                        width: '8%'
                    },
                    {
                        name: '游戏类型',
                        width: '8%'
                    },
                    {
                        name: '局号',
                        width: '8%'
                    },
                    {
                        name: '桌号',
                        width: '8%'
                    },
                    {
                        name: '投注时间',
                        width: '10%'
                    },
                    {
                        name: '玩法类型',
                        width: '8%'
                    },
                    {
                        name: '投注额',
                        width: '8%'
                    },
                    {
                        name: '有效投注额度',
                        width: '8%'
                    },
                    {
                        name: '盈亏',
                        width: '8%'
                    },
                    {
                        name: '订单状态',
                        width: '8%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/agmanager/agbetlist.json'
                },
                exportOps: {
                    url: '/intra/betmng/download'
                }
            });
        },

        onRender: function () {
            //初始化时间选择
            this.timeset = new Global.Prefab.Timeset({
                el: this.$('.js-ag-bet-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                showToday: true
            }).render();

            var self = this;
            //初始化时间选择控件
            this.$btnGroup = this.$('.js-ag-btnGroup');
            this.timeset.$startDate.on('dp.change', function () {
                if (self.btnGroup) {
                    self.btnGroup.clearSelect();
                }
            });

            this.timeset.$endDate.on('dp.change', function () {
                if (self.btnGroup) {
                    self.btnGroup.clearSelect();
                }
            });

            this.btnGroup = new Global.Prefab.BtnGroup({
                el: this.$btnGroup,
                onBtnClick: function (offset) {
                    self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
                    self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day'));
                },
                btnGroup: [
                    {
                        title: '今日',
                        value: 0,
                        active: true
                    },
                    {
                        title: '过去3天',
                        value: -3
                    },
                    {
                        title: '过去7天',
                        value: -7
                    }
                ]
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
                        colspan: 5
                    },
                    _(gridData.betTotal).fixedConvert2yuan(),
                    _(gridData.validBetTotal).convert2yuan(),
                    _(gridData.bonusTotal).convert2yuan(),
                    {
                        colspan: 2
                    }
                ]
            })
                .hideLoading();
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.billNo);
            row.push(rowInfo.player);
            if(rowInfo.platformType==1){
                row.push("AG国际厅");
            }else{
                row.push("/");
            }
            if(rowInfo.gameType==1){
                row.push("百家乐");
            }else{
                row.push("/");
            }
            row.push(rowInfo.gameCode);
            row.push(rowInfo.tableCode);
            row.push(_(rowInfo.betTime).toTime());
            if(rowInfo.playType==1){
                row.push("百家乐");
            }else{
                row.push("/");
            }
            row.push(_(rowInfo.betAmount).fixedConvert2yuan());
            row.push(_(rowInfo.validBetamount).fixedConvert2yuan());
            if(rowInfo.netAmount>=0){
                row.push('+' + _(rowInfo.netAmount).fixedConvert2yuan());
            }else{
                row.push('-' + _(rowInfo.netAmount).fixedConvert2yuan());
            }
            row.push("已派彩");

            return row;
        },

    });

    module.exports = AgBetRecordView;
});
