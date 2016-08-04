define(function (require, exports, module) {
    var AddFeedBackView = require('saleCenter/views/games-addFeedback');
    require('prefab/views/searchGrid');
    var FeedbackManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/games-feedbackManage.html'),

        events: {
            'click .js-fm-addUsers': 'addUserHandler',
            'click .js-fm-del': 'delFbHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '问题反馈管理',
                columns: [
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '状态',
                        width: '10%'
                    },
                    {
                        name: '操作',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/task/taskstatuslist.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.taskList).map(function (userInfo, index) {
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
            row.push('已完成');
            row.push('<button data-id="' + rowInfo.userId + '" data-type="'+rowInfo.taskId+'" class="js-fm-del btn btn-link">删除</button>');
            return row;
        },
        addUserHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '导入完成任务用户',
                    body: '<div class="js-fm-add-form"></div>',
                    footer: '<button class="js-fm-addUsers-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit" data-loading-text="保存中">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-fm-add-form');

            var addFbView = new AddFeedBackView();
            $selectContainer.html(addFbView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                addFbView.destroy();
            });

            $dialog.off('click.newUser')
                .on('click.newUser', '.js-fm-addUsers-confirm', function (ev) {
                    var $target = $(ev.currentTarget);
                    var clpValidate = $dialog.find('.js-fm-addUsers-form').parsley().validate();
                    var tId=13;
                    if (clpValidate) {
                        $target.button('loading');
                        Global.sync.ajax({
                            url: '/intra/task/taskstatusimport.json',
                            data: {
                                username: $dialog.find('.js-fm-usernameList').val(),
                                taskId:tId
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
                                    $dialog.find('.js-fm-addUsers-form')[0].reset();
                                    Global.ui.notification.show('操作成功。');
                                    self._getGridXhr();
                                    // $dialog.modal('hide');
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });

        },
        delFbHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var uId = this.$('.js-fm-del').data("id");
            var tId=this.$('.js-fm-del').data("type");
            if (uId) {
                var $dialog = Global.ui.dialog.show(
                    {
                        title: '提示',
                        body: '<div class="text-center" ><p>确认删除此信息？</p></div>',
                        footer: '<button class="js-qm-delFm-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                    }
                );
                $target.button('reset');

                $dialog.on('hidden.bs.modal', function () {
                    $(this).remove();
                });

                $dialog.off('click.deleteRecord')
                    .on('click.deleteRecord', '.js-qm-delFm-confirm', function (ev) {
                        var $target = $(ev.currentTarget);
                        $target.button('loading');
                        Global.sync.ajax({
                            url: '/intra/task/taskstatusdel.json ',
                            data: {
                                taskId : tId,
                                userId:uId
                            }
                        })
                            .always(function () {
                                $target.button('reset');
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
                    });
            }else{
                $target.button('reset');
            }
        }
    });
    module.exports = FeedbackManageView;
});