define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var VipChangeRecordView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareGifts.html'),

        events: {
            'click .js-gs-allLevel': 'selectAllLevelHandler'
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
                        name: '创建时间',
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
                        name: '礼金名称',
                        width: '10%'
                    },
                    {
                        name: '金额',
                        width: '10%'
                    },
                    {
                        name: '备注',
                        width: '10%'
                    },
                    {
                        name: '发放时间',
                        width: '10%'
                    },
                    {
                        name: '发放方式',
                        width: '5%'
                    },
                    {
                        name: '状态',
                        width: '5%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/vipmanager/giftdetail.json'

                },
                sameNameFormat: true
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-gs-create-timeset'),
                startTime: 'fromTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                showToday: true
            }).render();
            new Global.Prefab.Timeset({
                el: this.$('.js-gs-send-timeset'),
                startTime: 'doFromTime',
                endTime: 'doeEndTime',
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
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.userName);
            row.push('V'+rowInfo.level);
            if(rowInfo.type==1){
                row.push('<span>晋级礼金</span>');
            }else if(rowInfo.type==2){
                row.push('<span>保级礼金</span>');
            }else if(rowInfo.type==3){
                row.push('<span>生日礼金</span>');
            }else if(rowInfo.type==4){
                row.push('<span>粉红礼金</span>');
            }
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 4}));
            row.push(rowInfo.remark);
            row.push(_(rowInfo.doTime).toTime());
            if(rowInfo.mode==0){
                row.push('<span>系统发放</span>');
            }else if(rowInfo.mode==1){
                row.push('<span>客户领取</span>');
            }
            if(rowInfo.status==0){
                row.push('<span>未发放</span>');
            }else if(rowInfo.status==1){
                row.push('<span>已发放</span>');
            }
            return row;
        },
        selectAllLevelHandler: function(){
            var $target = this.$('.js-gs-allLevel');
            var checked = $target.prop('checked');
            if(checked){
                _(this.$('.js-gs-userLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-gs-userLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        }
    });

    module.exports = VipChangeRecordView;
});
//56250