define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var VipIntegralRecordView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipIntegralManagement/vipIntegralRecord.html'),

        events: {
            'click .js-tl-allLevel': 'selectAllLevelHandler'
        },
        initialize: function () {
            _(this.options).extend({
                title: '会员积分统计记录',
                columns: [
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '会员等级',
                        width: '10%'
                    },
                    {
                        name: '会员积分',
                        width: '10%'
                    },
                    {
                        name: 'V1',
                        width: '10%'
                    },
                    {
                        name: 'V2',
                        width: '10%'
                    },
                    {
                        name: 'V3',
                        width: '10%'
                    },
                    {
                        name: 'V4',
                        width: '10%'
                    },
                    {
                        name: 'V5',
                        width: '10%'
                    },
                    {
                        name: 'V6',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/vipmanager/integrallist.json'

                },
                sameNameFormat: true
            });
        },
        onRender: function () {
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
            row.push(rowInfo.username);
            row.push('V'+rowInfo.userLevel);
            row.push(_(rowInfo.integral).formatDiv(10000, {fixed: 0}));
            if(rowInfo.v1.indexOf("--")>=0){
                row.push(rowInfo.v1)
            }else{
                if(parseInt(rowInfo.v1)<100){
                    row.push('<label class="text-danger">'+rowInfo.v1+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v1+'%</label>')
                }
            }
            if(rowInfo.v2.indexOf("--")>=0){
                row.push(rowInfo.v2)
            }else{
                if(parseInt(rowInfo.v2)<100){
                    row.push('<label class="text-danger">'+rowInfo.v2+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v2+'%</label>')
                }
            }
            if(rowInfo.v3.indexOf("--")>=0){
                row.push(rowInfo.v3)
            }else{
                if(parseInt(rowInfo.v3)<100){
                    row.push('<label class="text-danger">'+rowInfo.v3+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v3+'%</label>')
                }
            }
            if(rowInfo.v4.indexOf("--")>=0){
                row.push(rowInfo.v4)
            }else{
                if(parseInt(rowInfo.v4)<100){
                    row.push('<label class="text-danger">'+rowInfo.v4+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v4+'%</label>')
                }
            }
            if(rowInfo.v5.indexOf("--")>=0){
                row.push(rowInfo.v5)
            }else{
                if(parseInt(rowInfo.v5)<100){
                    row.push('<label class="text-danger">'+rowInfo.v5+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v5+'%</label>')
                }
            }
            if(rowInfo.v6.indexOf("--")>=0){
                row.push(rowInfo.v6)
            }else{
                if(parseInt(rowInfo.v6)<100){
                    row.push('<label class="text-danger">'+rowInfo.v6+'%</label>')
                }else{
                    row.push('<label class="text-success">'+rowInfo.v6+'%</label>')
                }
            }
            return row;
        },
        selectAllLevelHandler: function(){
            var $target = this.$('.js-tl-allLevel');
            var checked = $target.prop('checked');
            if(checked){
                _(this.$('.js-tl-userLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-tl-userLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        }
    });

    module.exports = VipIntegralRecordView;
});
//56250