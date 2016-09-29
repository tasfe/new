define(function (require, exports, module) {

    require('prefab/views/searchGrid');

    var AgUserDetailView = Base.Prefab.SearchGrid.extend({

        template: require('text!agGame/userManagement/ag-userList.html'),

        events: {
            'click .js-ul-bet': 'userBetHandler'
        },
        initialize: function () {

            _(this.options).extend({
                title: 'ag用户列表',
                columns: [
                    {
                        name: '主账号',
                        width: '10%'
                    },
                    {
                        name: 'AG账号',
                        width: '10%'
                    },
                    {
                        name: '用户组（彩票）',
                        width: '10%'
                    },
                    {
                        name: 'AG个人余额',
                        width: '10%'
                    },
                    {
                        name: '注册时间',
                        width: '10%',
                        sortable: true,
                        id: 4
                    },
                    {
                        name: '不活跃天数<i class="js-ul-uDays fa fa-question-circle font-14 cursor-pointer"></i>',
                        width: '10%',
                        sortable: true,
                        id: 5
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/agmanager/getaguserlist.json'
                },
                subOps: {
                    data: ['userParentId']
                },
                breadUseSearch: false,
                breadResetSearch: false
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-ag-ul-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                showToday: false
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);

        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.userList).map(function (userInfo, index) {
                return {
                    columnEls: this.formatRowData(userInfo, index),
                    dataAttr: userInfo
                };
            }, this);

            if (!_(gridData.parents).isEmpty()) {
                this._breadList = _(gridData.parents).map(function (parent, index) {
                    return {
                        data: {
                            userParentId: parent.userId
                        },
                        label: parent.userName
                    };
                });
                this.renderBread();
            }

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            })
                .hideLoading();
            //初始化不活跃天数说明
            this.$('.js-ul-uDays').popover({
                trigger: 'hover',
                title: '不活跃天数定义',
                content: '连续多少天内无任何账变，即为不活跃的天数',
                placement: 'bottom'
            });
        },

        formatRowData: function (rowInfo) {
            var row = [];

            if (rowInfo.subNum) {
                row.push('<a class="js-pf-sub" data-label="' + rowInfo.username +
                    '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
                    rowInfo.username + '</a> (' + rowInfo.subNum + ')');
            } else {
                row.push(rowInfo.username);
            }
            row.push(rowInfo.agName);
            if (rowInfo.parentId == 0) {
                row.push('招商');
            } else {
                row.push(rowInfo.userGroup);
            }
            row.push(_(rowInfo.balance).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.regTime).toTime());
            row.push(rowInfo.uDays);
            return row;
        },
        _formatOperation: function (rowInfo) {
            var cell = [];
            if (Global.authority.ag && Global.authority.ag.ul && Global.authority.ag.ul.detail) {
                cell.push('<a href="' + _.getUrl('/detail/' + rowInfo.userId, {
                        'name': rowInfo.username,
                        'rightTag': '1'
                    }) + '" class="router btn btn-link">详情</a>');
            }
            return cell.join('');
        }
    });

    module.exports = AgUserDetailView;
});
//56250