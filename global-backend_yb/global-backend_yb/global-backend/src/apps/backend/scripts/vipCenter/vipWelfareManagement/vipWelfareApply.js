define(function (require, exports, module) {
    var CheckReqView = require('vipCenter/vipWelfareManagement/vipWelfareReqCheck');
    var CheckReqAgainView = require('vipCenter/vipWelfareManagement/vipWelfareReqAgainCheck');
    var CheckLogView = require('vipCenter/vipWelfareManagement/vipWelfareReqCheckLog');
    require('prefab/views/searchGrid');
    var VipWelfareApplyView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareApply.html'),

        events: {
            'click .js-ap-check': 'checkReqHandler',
            'click .js-ap-check-again': 'checkReqAgainHandler',
            'click .js-ap-log': 'showLogHandler'
        },
        initialize: function () {
            _(this.options).extend({
                title: '信誉基金申请记录',
                columns: [
                    {
                        name: '申请编号',
                        width: '15%'
                    },
                    {
                        name: '申请日期',
                        width: '15%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    }, {
                        name: '会员等级',
                        width: '10%'
                    },
                    {
                        name: '申请金额',
                        width: '10%'
                    },
                    {
                        name: '批准金额',
                        width: '10%'
                    },
                    {
                        name: '状态',
                        width: '10%'
                    },
                    {
                        name: '操作',
                        width: '15%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/creditmng/reqlist.json'

                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-ap-timeset'),
                startTime: 'startDate',
                endTime: 'endDate',
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

            row.push(rowInfo.tradeNo);
            row.push(_(rowInfo.reqDate).toTime());
            row.push(rowInfo.username);
            row.push('V'+rowInfo.userLevel);
            row.push(_(rowInfo.reqAmount).formatDiv(10000, {fixed: 0}));
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 0}));
            row.push(rowInfo.status);
            if (rowInfo.status == '等待初审') {
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ap-check btn btn-link">初审</button>');
            } else if (rowInfo.status == '等待复审') {
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ap-check-again btn btn-link">复审</button>');
            } else if (rowInfo.status == '已批准'||rowInfo.status == '已拒绝') {
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ap-log btn btn-link">日志</button>');
            }
            return row;
        },
        checkReqHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle: 'width: 700px;',
                    title: '处理',
                    body: '<div class="js-ap-check"></div>',
                    footer: '<button class="js-ap-check-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'

                }
            );

            var $selectContainer = $dialog.find('.js-ap-check');

            var checkReqView = new CheckReqView({tradeNo: tradeNo});
            $selectContainer.html(checkReqView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

            $dialog.off('click.checkRepay')
                .on('click.checkRepay', '.js-ap-check-confirm', function (ev) {
                    var $currContainer = $dialog.find('.js-ap-check-form');
                    var clpValidate = $currContainer.parsley().validate();
                    if (clpValidate) {
                        var $target2 = $(ev.currentTarget);
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/creditmng/check.json',
                            data: {
                                tradeNo:tradeNo,
                                amount: $dialog.find('.js-ap-req-amount').val(),
                                status: $dialog.find('.js-ap-result:checked').val(),
                                remark: $dialog.find('.js-ap-remark').val(),
                                explanation:$dialog.find('.js-ap-des').val()
                            },
                            tradition: true
                        })
                            .always(function () {
                                $target2.button('reset');
                            })
                            .fail(function () {
                                // 处理失败
                            })
                            .done(function (res) {
                                if (res && res.result === 0) {
                                    Global.ui.notification.show('操作成功。');
                                    self._getGridXhr();
                                    $dialog.modal('hide');
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });

        },
        checkReqAgainHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle: 'width: 700px;',
                    title: '处理',
                    body: '<div class="js-ap-check-again"></div>',
                    footer: '<button class="js-ap-check-again-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'

                }
            );

            var $selectContainer = $dialog.find('.js-ap-check-again');

            var checkReqView = new CheckReqAgainView({tradeNo: tradeNo});
            $selectContainer.html(checkReqView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

            $dialog.off('click.checkRepay')
                .on('click.checkRepay', '.js-ap-check-again-confirm', function (ev) {
                    var $currContainer = $dialog.find('.js-ap-check-form');
                    var clpValidate = $currContainer.parsley().validate();
                    if (clpValidate) {
                        var $target2 = $(ev.currentTarget);
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/creditmng/check.json',
                            data: {
                                tradeNo:tradeNo,
                                amount: $dialog.find('.js-ap-req-amount').val(),
                                status: $dialog.find('.js-ap-result:checked').val(),
                                remark: $dialog.find('.js-ap-remark').val(),
                                explanation:$dialog.find('.js-ap-des').val()
                            },
                            tradition: true
                        })
                            .always(function () {
                                $target2.button('reset');
                            })
                            .fail(function () {
                                // 处理失败
                            })
                            .done(function (res) {
                                if (res && res.result === 0) {
                                    Global.ui.notification.show('操作成功。');
                                    self._getGridXhr();
                                    $dialog.modal('hide');
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });

        },
        showLogHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle: 'width: 700px;',
                    title: '日志',
                    body: '<div class="js-ap-log"></div>'
                }
            );

            var $selectContainer = $dialog.find('.js-ap-log');

            var showLogView = new CheckLogView({tradeNo: tradeNo});
            $selectContainer.html(showLogView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });
        }
    });

    module.exports = VipWelfareApplyView;
});
//56250