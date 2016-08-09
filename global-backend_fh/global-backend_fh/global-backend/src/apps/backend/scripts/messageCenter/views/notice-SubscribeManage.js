define(function (require, exports, module) {
    require('prefab/views/searchGrid');
    var SubscribeManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!messageCenter/templates/notice-SubscribeManage.html'),

        events: {},

        initialize: function () {
            _(this.options).extend({
                title: '站内信管理',
                columns: [
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '退订通知类型',
                        width: '15%'
                    },
                    {
                        name: '退订时间',
                        width: '6%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/systemnotice/getunsubscribeLoglist.json'
                }
            });
        },
        getNoticeConfXhr: function () {
            return Global.sync.ajax({
                url: '/intra/systemnotice/getnoticeconflist.json'
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-pu-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            this.getNoticeConfXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var confData = _(res.root).map(function (conf) {
                        return '<option value="' + conf.confId + '">' + conf.confName + '</option>';
                    });
                    self.$('.js-pu-type').html('<option value="">全部</option>' + confData.join(''));
                } else {
                    Global.ui.notification.show('数据异常。');
                }

            })
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.unsubscribeList).map(function (record, index) {
                return {
                    columnEls: this.formatRowData(record, index),
                    dataAttr: record
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
            row.push(rowInfo.noticeList);
            row.push(_(rowInfo.createTime).toTime());
            return row;
        }
    });

    module.exports = SubscribeManageView;
});