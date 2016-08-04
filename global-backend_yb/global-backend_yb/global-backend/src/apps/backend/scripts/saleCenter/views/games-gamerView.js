define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var GamerView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-gamerView.html'),

        events: {
        },

        initialize: function () {

            _(this.options).extend({
                title: '参与用户记录',
                columns: [
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '完成任务',
                        width: '20%'
                    },
                    {
                        name: '目前礼金',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/task/userstatuslist.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.userTaskList).map(function (userInfo, index) {
                return {
                    columnEls: this.formatRowData(userInfo, index),
                    dataAttr: userInfo
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
            row.push(rowInfo.userName);
            var tData = [];
            _(rowInfo.taskData).each(function (task) {
                tData.push(task);
            });
            row.push(tData.join('<br>'));
            row.push( _(rowInfo.amount)+'元');
            return row;
        }

    });
    module.exports = GamerView;
});