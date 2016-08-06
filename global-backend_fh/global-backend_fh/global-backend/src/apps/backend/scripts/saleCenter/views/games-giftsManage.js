define(function (require, exports, module) {
    var AddAmountView = require('saleCenter/views/games-addAmount');
    require('prefab/views/searchGrid');
    var GiftsManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-giftsManage.html'),

        events: {
            'click .js-gm-addUsers': 'addGiftsHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '用户礼金管理',
                columns: [
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '操作类型',
                        width: '10%'
                    },
                    {
                        name: '金额',
                        width: '10%'
                    },
                    {
                        name: '操作人',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/task/taskamountlist.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.amountList).map(function (userInfo, index) {
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
            row.push(rowInfo.optType);
            row.push(rowInfo.amount+'元');
            row.push(rowInfo.operator);
            return row;
        },
        addGiftsHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '增减用户礼金',
                    body: '<div class="js-gm-addAmount-form"></div>',
                    footer: '<button class="js-gm-addUsers-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit" data-loading-text="保存中">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-gm-addAmount-form');

            var addAmountView = new AddAmountView();
            $selectContainer.html(addAmountView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                addAmountView.destroy();
            });

            $dialog.off('click.amount')
                .on('click.amount', '.js-gm-addUsers-confirm', function (ev) {
                    var $target = $(ev.currentTarget);
                    var clpValidate = $dialog.find('.js-gm-addUsers-form').parsley().validate();
                    if (clpValidate) {
                        $target.button('loading');
                        Global.sync.ajax({
                            url: '/intra/task/taskamountadd.json',
                            data: {
                                username: $dialog.find('.js-gm-usernameList').val(),
                                optType:$dialog.find('.js-gm-optType').val(),
                                amount:$dialog.find('.js-gm-amount').val()

                            },
                            tradition: true
                        })
                            .always(function () {
                                $target.button('reset');
                            })
                            .fail(function () {
                                // 处理失败
                            })
                            .done(function (res) {
                                if (res && res.result === 0) {
                                    //$dialog.find('.js-bl-title').val('');
                                    $dialog.find('.js-gm-addUsers-form')[0].reset();
                                    Global.ui.notification.show('操作成功。');
                                    self._getGridXhr();
                                    // $dialog.modal('hide');
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });

        }

    });
    module.exports = GiftsManageView;
});