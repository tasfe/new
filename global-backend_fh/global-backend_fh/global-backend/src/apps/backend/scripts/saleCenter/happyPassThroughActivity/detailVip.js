define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var DetailVipView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/happyPassThroughActivity/detailVip.html'),

        events: {
            'click .js-btn-discounted':'discountedHanlder'
        },

        sendTradeidXhr:function (data) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/use.json',
                tradeNo:data
            });
        },

        initialize: function () {
            _(this.options).extend({
                title: '欢乐大闯关活动查看会员',
                columns: [
                    {
                        name: '完成时间',
                        width: '15%'
                    },
                    {
                        name: '用户名',
                        width: '14%'
                    },
                    {
                        name: '任务关卡',
                        width: '14%'
                    },
                    {
                        name: '类型',
                        width: '14%'
                    },
                    {
                        name: '活动奖金',
                        width: '14%'
                    },
                    {
                        name: '所属直属',
                        width: '14%'
                    },
                    {
                        name: '操作',
                        width: '14%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },reqData: {
                    activityId:40
                },
                ajaxOps: {
                    url: '/intra/activitymanage/happystagelist.json'
                }
            });
        },

        onRender: function () {
            var self = this;
            //初始化时间选择
            this.timeset = new Global.Prefab.Timeset({
                el: this.$('.js-hp-detailVip-timeset'),
                startTime: 'fromDate',
                endTime: 'endDate',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            gridData = {
                "rowCount": 2,
                "bonusTotal": 70000,
                "dataList": [
                    {
                        "createTime": 1479390012858,
                        "userName": "lance2016",
                        "status": 1,
                        "type": 1,
                        "bonus": 50000,
                        "superName": null,
                        "tradeId": "HD20161116214000IBJ6",
                        "useStatus": 0
                    },
                    {
                        "createTime": 1479194823309,
                        "userName": "collen2016",
                        "status": 0,
                        "type": 0,
                        "bonus": 20000,
                        "superName": null,
                        "tradeId": "HD20161115152700IB45",
                        "useStatus": 1
                    }
                ]
            };
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
            this.grid.addRows({
                columnEls: [
                    '<strong>所有页总计</strong>',
                    {
                        colspan: 3
                    },
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
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.userName);
            row.push('第'+rowInfo.status+'关');
            switch (rowInfo.type){
                case 0:
                    row.push('绑卡奖金');
                    break;
                case 1:
                    row.push('充值奖金');
                    break;
                case 2:
                    row.push('消费奖金');
                    break;
                case 3:
                    row.push('提现奖金');
                    break;
                case 4:
                    row.push('抽奖奖金');
                    break;
                case 5:
                    row.push('抽奖实物');
                    break;
            }
            row.push(_.formatDiv(rowInfo.bonus,10000));
            row.push(rowInfo.superName);
            if(rowInfo.useStatus === 0){
                row.push('<button class="btn btn-sm btn-success js-btn-discounted" data-tradeId="'+ rowInfo.tradeId +'">折现</button>');
            }else if(rowInfo.useStatus === 1){
                row.push('<button class="btn btn-sm btn-link" >已折现</button>');
            }
            return row;
        },

        discountedHanlder:function(e){
            var self = this;
            var $target = $(e.target);
            var tradeId = $target.attr('data-tradeId');
            this.sendTradeidXhr(tradeId)
                .done(function (res) {
                    if(res.result === 0){
                        self._getGridXhr();
                    }
                });
        }


    });

    module.exports = DetailVipView;
});