define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var DisabledUserListView = Base.Prefab.SearchGrid.extend({

        template: require('text!userCenter/templates/abnormalUser-disabledUserList.html'),

        events: {},
        initialize: function () {

            _(this.options).extend({
                title: '冻结用户记录',
                columns: [
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '用户组',
                        width: '6%'
                    },
                    {
                        name: '个人余额',
                        width: '6%',
                        sortable: true,
                        id: 3
                    },
                    {
                        name: '冻结范围',
                        width: '6%'
                    },
                    {
                        name: '冻结方式',
                        width: '6%'
                    },
                    {
                        name: '冻结原因',
                        width: '10%'
                    },
                    {
                        name: '冻结时间',
                        width: '10%'
                    },
                    {
                        name: '操作人',
                        width: '5%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/usermanager/getmanagelist.json'
                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-fu-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                showToday: true
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            this.creater = 0;
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.recordList).map(function (disable, index) {
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
            var userData = _(gridData.manager).map(function (sUser) {
                return '<option value="' + sUser.creater + '">' + sUser.createrName + '</option>';
            });
            if (this.creater === 0) {
                self.$('.js-fu-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.userName);
            row.push(rowInfo.userGroup);
            row.push('￥' + _(rowInfo.balance).formatDiv(10000, {fixed: 4}));
            row.push(rowInfo.range);
            row.push(rowInfo.type);
            row.push(rowInfo.reason);
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.creater);
            return row;
        }

    });

    module.exports = DisabledUserListView;
});