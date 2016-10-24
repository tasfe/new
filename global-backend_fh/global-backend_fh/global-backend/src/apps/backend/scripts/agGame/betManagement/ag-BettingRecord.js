/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var AgBetRecordView = Base.Prefab.SearchGrid.extend({

        template: require('text!agGame/betManagement/ag-BettingRecord.html'),

        events: {
            'change .js-ag-platform':'selectAgGameType'
        },

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
        checkAgPlatformXhr:function(data){
            return Global.sync.ajax({
                url: '/intra/agmanager/aghalllist.json',
                data: data
            });
        },
        checkAgGameTypeXhr:function(data){
            return Global.sync.ajax({
                url: '/intra/agmanager/aggametype.json',
                data: data
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
            this.platform = 0;
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },


        renderGrid: function (gridData) {
            var self = this;
            var rowsData = _(gridData.dataList).map(function (order, index) {
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
                        colspan: 6
                    },
                    _(gridData.betTotal).fixedConvert2yuan(),
                    _(gridData.validBetTotal).convert2yuan(),
                    _(gridData.bonusTotal).convert2yuan(),
                    {
                        colspan: 1
                    }
                ]
            })
                .hideLoading();
            this.checkAgPlatformXhr().fail(function(){
            }).done(function(res){
                if(res.result===0){
                    var userData = _(res.root).map(function (name) {
                        return '<option value="' + name.hallId + '">' + name.hallName + '</option>';
                    });
                    if (self.platform === 0) {
                        self.$('.js-ag-platform').html('<option value="">全部</option>' + userData.join(''));
                        self.platform = 1;
                    }
                }else{
                    self.$('.js-ag-platform').html('<option value="">全部</option>');
                }
            });
            self.$('.js-ag-type').html('<option value="">全部</option>');

        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.billNo);
            row.push(rowInfo.player);
            if(rowInfo.platformType==0){
                row.push("/");
            }else if(rowInfo.platformType==1){
                row.push("国际厅");
            }else if(rowInfo.platformType==2){
                row.push("旗舰厅");
            }else if(rowInfo.platformType==3){
                row.push("包桌厅");
            }else if(rowInfo.platformType==4){
                row.push("豪华厅");
            }
            if(rowInfo.gameType==0){
                row.push("/");
            }else if(rowInfo.gameType==1){
                row.push("百家乐");
            }else if(rowInfo.gameType==2){
                row.push("包桌百家乐");
            }else if(rowInfo.gameType==3){
                row.push("连环百家乐");
            }else if(rowInfo.gameType==4){
                row.push("龙虎");
            }else if(rowInfo.gameType==5){
                row.push("骰宝");
            }else if(rowInfo.gameType==6){
                row.push("轮盘");
            }else if(rowInfo.gameType==7){
                row.push("番摊");
            }else if(rowInfo.gameType==8){
                row.push("竞咪百家乐");
            }else if(rowInfo.gameType==9){
                row.push("终极德州扑克");
            }else if(rowInfo.gameType==10){
                row.push("保险百家乐");
            }
            row.push(rowInfo.gameCode);
            row.push(rowInfo.tableCode);
            row.push(_(rowInfo.betTime).toTime());
            row.push(_(rowInfo.betAmount).fixedConvert2yuan());
            row.push(_(rowInfo.validBetamount).fixedConvert2yuan());
            if(rowInfo.netAmount>=0){
                row.push('+' + _(rowInfo.netAmount).fixedConvert2yuan());
            }else{
                row.push(_(rowInfo.netAmount).fixedConvert2yuan());
            }
            row.push("已派彩");

            return row;
        },
        selectAgGameType:function(e){
            var self=this;
            var pId= $(e.currentTarget).val();
            this.checkAgGameTypeXhr({
                hallId:pId
            }).fail(function(){
            }).done(function(res){
                if(res.result===0){
                    var userData = _(res.root).map(function (name) {
                        return '<option value="' + name.typeId + '">' + name.typeName + '</option>';
                    });
                    self.$('.js-ag-type').html('<option value="">全部</option>' + userData.join(''));
                }else{
                    self.$('.js-ag-type').html('<option value="">全部</option>');
                }
            });
        }
    });

    module.exports = AgBetRecordView;
});
