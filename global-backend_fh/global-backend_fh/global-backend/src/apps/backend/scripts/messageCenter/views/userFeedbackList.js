define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var UserFeedbackList = Base.Prefab.SearchGrid.extend({

        template: require('text!messageCenter/templates/userFeedbackList.html'),

        events: { },

        initialize: function () {
            _(this.options).extend({
                title: '反馈管理',
                columns: [
                    {
                        name: '用户名',
                        width: '18%'
                    },
                    {
                        name: '反馈类型',
                        width: '18%'
                    },
                    {
                        name: '主题',
                        width: '18%'
                    },
                    {
                        name: '反馈时间',
                        width: '18%'
                    },
                    {
                        name: '内容详情',
                        width: '28%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/feedback/list.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.dataList).map(function (data, index) {
                return {
                    columnEls: this.formatRowData(data, index),
                    dataAttr: data
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
            row.push(rowInfo.type);
            row.push(rowInfo.title);
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.content);
            return row;
        }
    });
    module.exports = UserFeedbackList;
});