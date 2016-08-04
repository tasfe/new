define(function (require, exports, module) {
    var RewardDetailView = require('saleCenter/views/games-agentRewardDetailEachDay');
    require('prefab/views/searchGrid');
    var AgentRewardDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-agentRewardDetail.html'),

        events: {
            'click .js-wc-detail': 'detailHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '代理冲量活动查看',
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
                        name: '返点等级',
                        width: '6%'
                    },
                    {
                        name: '消费金额',
                        width: '6%'
                    }
                    ,
                    {
                        name: '奖励标准',
                        width: '6%'
                    },
                    {
                        name: '领取状态',
                        width: '6%'
                    },
                    {
                        name: '操作',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/sprintactivity/detaillist.json'
                }
            });
        },
        onRender: function () {
            var self = this;
            //初始化时间选择
            //new Global.Prefab.Timeset({
            //    el: this.$('.js-lk-timeset'),
            //    startTime: 'fromDate',
            //    endTime: 'endDate',
            //    endDate: moment().add(1, 'year')
            //}).render();
            self.$('.js-lk-timeset').datetimepicker({
                  format: 'YYYY-MM-DD'
              }
            );
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.agentSprintDetailDTOList).map(function (dataInfo, index) {
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
            row.push(rowInfo.settlementDate);
            row.push(rowInfo.username);
            row.push(_(rowInfo.userRebate).formatDiv(10, {fixed: 1})+'%');
            row.push(_(rowInfo.betTotal).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.actualReward).formatDiv(10000, {fixed: 4}));
            if(rowInfo.getStatus==0){
                row.push("未领取");
            }
            if(rowInfo.getStatus==1){
                row.push("已领取");
            }
            row.push('<button data-id="' + rowInfo.id + '" data-type="' + rowInfo.username + '" data-start="'+_(rowInfo.startDate).toDate()+'" data-end="'+_(rowInfo.endDate).toDate()+'" class="js-wc-detail btn btn-link">查看每日明细</button>');
            return row;
        },
        detailHandler: function(e) {
            var $target = $(e.currentTarget);
            //var data = this.grid.getRowData($target);
            var name = $target.data('type');
            var startDate=$target.data('start');
            var endDate=$target.data('end');
            var $dialog = Global.ui.dialog.show({
                title: name + '的分红明细',
                size: 'modal-lg',
                body: '<div class="js-wc-detail"></div>',
                footer: ''
            });

            var $detail = $dialog.find('.js-wc-detail');

            $dialog.on('hidden.modal', function() {
                $(this).remove();
                rewardDetailView.destroy();
            });

            var rewardDetailView = new RewardDetailView({
                username: name,
                startDay: startDate,
                endDay:endDate,
                el: $detail
            }).render();
        }

    });
    module.exports = AgentRewardDetailView;
});