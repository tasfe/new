define(function (require, exports, module) {
    var CheckRepayView = require('vipCenter/vipWelfareManagement/vipWelfareRepayCheck');
    var ShowRepayView = require('vipCenter/vipWelfareManagement/vipWelfareRepayShow');
    var LogRepayView = require('vipCenter/vipWelfareManagement/vipWelfareRepayLog');
    require('prefab/views/searchGrid');
    var VipWelfareRepayView = Base.Prefab.SearchGrid.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareRepay.html'),

        events: {
            'click .js-ry-check': 'checkRepayHandler',
            'click .js-ry-view': 'showRepayHandler',
            'click .js-ry-log': 'showLogHandler'
        },
        initialize: function () {
            _(this.options).extend({
                title: '信誉基金还款记录',
                columns: [
                    {
                        name: '申请编号',
                        width: '15%'
                    },
                    {
                        name: '放款时间',
                        width: '15%'
                    },
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '借款金额',
                        width: '10%'
                    },
                    {
                        name: '投注流水要求',
                        width: '10%'
                    },
                    {
                        name: '借款状态',
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
                    url: '/intra/creditmng/repaymentlist.json'

                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-ry-timeset'),
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
            row.push(_(rowInfo.createDate).toTime());
            row.push(rowInfo.username);
            row.push(_(rowInfo.amount).formatDiv(10000, {fixed: 0}));
            row.push(_(rowInfo.betLimit).formatDiv(10000, {fixed: 0}));
            row.push(rowInfo.status);
            if(rowInfo.status=='还款中'){
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ry-check btn btn-link">处理</button><button data-id="' + rowInfo.tradeNo + '" class="js-ry-view btn btn-link">查看</button>');
            }else if(rowInfo.status=='已结清'){
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ry-log btn btn-link">日志</button>');
            }else if(rowInfo.status=='已免除'){
                row.push('<button data-id="' + rowInfo.tradeNo + '" class="js-ry-log btn btn-link">日志</button>');
            }
            return row;
        },
        checkRepayHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle:'width: 700px;',
                    title: '处理',
                    body: '<div class="js-ry-check-repay"></div>',
                    footer: '<button class="js-ry-check-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'

                }
            );

            var $selectContainer = $dialog.find('.js-ry-check-repay');

            var checkRepayView = new CheckRepayView({tradeNo: tradeNo});
            $selectContainer.html(checkRepayView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

            $dialog.off('click.checkRepay')
                .on('click.checkRepay', '.js-ry-check-confirm', function (ev) {
                    self.confHandle($dialog,ev,tradeNo,self);
                });

        },
        confHandle:function($dialog,ev,tradeNo,self){
            var type=$dialog.find('.js-ry-range:checked').val();
            var bet=$dialog.find('.js-ry-remitBet').val();
            var balance=$dialog.find('.js-ry-takeBalance').val();
            var content='';
            if(type==0){
                content='<div class="text-center"><span style="font-size: 16px !important;">若正常结算，会优先扣除流水来冲抵借款（每'+bet+'流水可抵消'+balance+'元借款），</span><br><span style="font-size: 16px !important;">若流水不足，会再从账户余额中进行扣款。您确定要继续吗？</span></div>'
            }else if(type==1){
                content='<div class="text-center"><span style="font-size: 16px !important;">若免除剩余流水，该笔借款将被结清，您确定要继续吗？</span></div>'
            }
            $(document).confirm({
                content:content,
                agreeCallback: function () {
                    var $currContainer = $dialog.find('.js-ry-check-form');
                    var clpValidate = $currContainer.parsley().validate();
                    if (clpValidate) {
                        var $target2 = $(ev.currentTarget);
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/creditmng/repaymentclose.json',
                            data: {
                                tradeNo: tradeNo,
                                type: $dialog.find('.js-ry-range:checked').val(),
                                remark: $dialog.find('.js-ry-remark').val()
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
                                    Global.ui.notification.show(res.msg);
                                    self._getGridXhr();
                                    $dialog.modal('hide');
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                }
            });
    },
        showRepayHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle:'width: 700px;',
                    title: '查看',
                    body: '<div class="js-ry-show-repay"></div>'
                }
            );

            var $selectContainer = $dialog.find('.js-ry-show-repay');

            var showRepayView = new ShowRepayView({tradeNo: tradeNo});
            $selectContainer.html(showRepayView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

        },
        showLogHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var tradeNo = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle:'width: 700px;',
                    title: '日志',
                    body: '<div class="js-ry-log-repay"></div>'
                }
            );

            var $selectContainer = $dialog.find('.js-ry-log-repay');

            var logRepayView = new LogRepayView({tradeNo: tradeNo});
            $selectContainer.html(logRepayView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });
        }
    });

    module.exports = VipWelfareRepayView;
});
//56250