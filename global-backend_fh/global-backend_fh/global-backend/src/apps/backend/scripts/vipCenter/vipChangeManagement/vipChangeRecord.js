define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var VipChangeRecordView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipChangeManagement/vipChangeRecord.html'),

        events: {
            'click .js-rd-allBeforeLevel': 'selectAllBeforeLevelHandler',
            'click .js-rd-allAfterLevel': 'selectAllAfterLevelHandler'
        },
        initialize: function () {
            _(this.options).extend({
                title: '会员等级调整记录',
                columns: [
                    {
                        name: '调整日期',
                        width: '15%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '原会员等级',
                        width: '10%'
                    },
                    {
                        name: '新会员等级',
                        width: '10%'
                    },
                    {
                        name: '调整类型',
                        width: '10%'
                    },
                    {
                        name: '备注',
                        width: '15%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/vipmanager/adjustdetail.json'

                },
                sameNameFormat: true
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-rd-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                showToday: true
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            this.creater = 0;
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

            row.push(rowInfo.date);
            row.push(rowInfo.userName);
            row.push(rowInfo.before);
            row.push(rowInfo.after);
            if(rowInfo.type==0){
                row.push('<span>升级</span>');
            }else if(rowInfo.type==1){
                row.push('<span>保级</span>');
            }else if(rowInfo.type==2){
                row.push('<span>降级</span>');
            }

            row.push(rowInfo.remark);
            return row;
        },
        selectAllBeforeLevelHandler: function(){
            var $target = this.$('.js-rd-allBeforeLevel');
            var checked = $target.prop('checked');
            if(checked){
                _(this.$('.js-rd-userBeforeLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-rd-userBeforeLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        },
        selectAllAfterLevelHandler: function(){
            var $target = this.$('.js-rd-allAfterLevel');
            var checked = $target.prop('checked');
            if(checked){

                _(this.$('.js-rd-userAfterLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-rd-userAfterLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        }

    });

    module.exports = VipChangeRecordView;
});
//56250