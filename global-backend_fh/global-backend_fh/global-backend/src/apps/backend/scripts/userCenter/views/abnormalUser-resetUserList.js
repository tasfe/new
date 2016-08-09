define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var ResetUserListView = Base.Prefab.SearchGrid.extend({

        template: require('text!userCenter/templates/abnormalUser-resetUserList.html'),

        events: {},
        initialize: function () {
            _(this.options).extend({
                title: '申诉用户记录',
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
                        name: '申诉动作',
                        width: '15%'
                    },
                    {
                        name: '申诉原因',
                        width: '10%'
                    },
                    {
                        name: '申诉时间',
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
                    url: '/intra/usermanager/getresetlist.json'

                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-cu-timeset'),
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
                self.$('.js-cu-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.userName);
            row.push(rowInfo.userGroup);
            row.push('￥' + _(rowInfo.balance).formatDiv(10000, {fixed: 4}));
            row.push(rowInfo.actionName);
            row.push(rowInfo.reason);
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.createrName);
            return row;
        }

    });

    module.exports = ResetUserListView;
});
//56250