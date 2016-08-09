define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var VipWelfareAwardView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareAward.html'),

        events: {
            'click .js-ad-allLevel': 'selectAllLevelHandler'
        },
        initialize: function () {
            _(this.options).extend({
                title: '会员礼金发放记录',
                columns: [
                    {
                        name: '流水号',
                        width: '15%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '会员等级',
                        width: '10%'
                    },
                    {
                        name: '领取时间',
                        width: '10%'
                    },
                    {
                        name: '累计中奖金额',
                        width: '10%'
                    },
                    {
                        name: '加奖比例',
                        width: '15%'
                    },
                    {
                        name: '加奖金额',
                        width: '10%'
                    },
                    {
                        name: '备注',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/vipmanager/awarddetail.json'

                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-ad-timeset'),
                startTime: 'fromTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                showToday: true
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.dataList).map(function (disable, index) {
                return {
                    columnEls: this.formatRowData(disable, index),
                    dataAttr: disable
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

            row.push(rowInfo.tradeNo);
            row.push(rowInfo.userName);
            row.push('V'+rowInfo.level);
            row.push(_(rowInfo.createTime).toTime());
            row.push(_(rowInfo.prize).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.rate).formatDiv(100, {fixed: 2}));
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 4}));
            row.push(rowInfo.remark);
            return row;
        },
        selectAllLevelHandler: function(){
            var $target = this.$('.js-ad-allLevel');
            var checked = $target.prop('checked');
            if(checked){
                _(this.$('.js-ad-userLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-ad-userLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        }
    });

    module.exports = VipWelfareAwardView;
});
//56250