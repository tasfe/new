define(function (require, exports, module) {
    var ShowNoticeDetailView = require('messageCenter/views/notice-ShowNoticeDetail');
    require('prefab/views/searchGrid');
    var NoticeManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!messageCenter/templates/notice-NoticeManage.html'),

        events: {
            'click .js-pm-show': 'showNoticeDetailHandler',
            'click .js-pm-del': 'delNoticeHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '系统通知管理',
                columns: [
                    {
                        name: '主题',
                        width: '10%'
                    },
                    {
                        name: '发送时间',
                        width: '6%'
                    },
                    {
                        name: '状态',
                        width: '6%'
                    },
                    {
                        name: '操作人',
                        width: '6%'
                    },
                    {
                        name: '操作',
                        width: '6%'
                    }

                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/systemnotice/getnoticelist.json'
                }
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-pm-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year')
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            this.creater = 0;
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.noticeList).map(function (notice, index) {
                return {
                    columnEls: this.formatRowData(notice, index),
                    dataAttr: notice
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.recordNum, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            })
                .hideLoading();
            var userData = _(gridData.manager).map(function (sUser) {
                return '<option value="' + sUser.creater + '">' + sUser.createrName + '</option>';
            });
            if (this.creater === 0) {
                self.$('.js-pm-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.title);
            row.push(_(rowInfo.sendTime).toTime());
            if(rowInfo.status==0){
                row.push('<span>待发送</span>');
            }
            if(rowInfo.status==1){
                row.push('<span>已发送</span>');
            }
            if(rowInfo.status==2){
                row.push('<span>已回收</span>');
            }
            row.push(rowInfo.createrName);
            row.push(this._formatOperation(rowInfo));
            return row;
        },
        _formatOperation: function (rowInfo) {
            var cell = [];

            if (rowInfo.status==2) {
                if(Global.authority.mc && Global.authority.mc.pm && Global.authority.mc.pm.view){
                    cell.push('<button data-id="' + rowInfo.noticeId + '"  class="js-pm-show btn btn-link">查看</button>');
                }
            } else {
                if(Global.authority.mc && Global.authority.mc.pm && Global.authority.mc.pm.view){
                    cell.push('<button data-id="' + rowInfo.noticeId + '"  class="js-pm-show btn btn-link">查看</button>');
                }
                if(Global.authority.mc && Global.authority.mc.pm && Global.authority.mc.pm.recycle){
                    cell.push('<button data-id="' + rowInfo.noticeId + '"  class="js-pm-del btn btn-link">回收</button>');
                }
            }
            return cell.join('');
        }
        ,
        //显示系统通知详情
        showNoticeDetailHandler: function (e) {
            var $target = $(e.currentTarget);
            var id = $target.data('id');
            var $dialog = Global.ui.dialog.show(
                {   size: 'modal-lg',
                    title: '查看公告',
                    body: '<div class="js-il-show-notice"></div>'
                }
            );
            var $selectContainer = $dialog.find('.js-il-show-notice');

            var showNoticeDetailView = new ShowNoticeDetailView({noticeId: id});
            $selectContainer.html(showNoticeDetailView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                showNoticeDetailView.destroy();
            });
        }
        ,
        //删除系统通知
        delNoticeHandler: function (e) {
            var $target = $(e.currentTarget);
            var id = $target.data('id');

            if (id) {
                var self = this;
                var $dialog = Global.ui.dialog.show(
                  {
                      title: '提示',
                      body: '<div ><p>确认回收此通知？</p></div>',
                      footer: '<button class="js-mc-delNotice-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
                  }
                );

                $dialog.on('hidden.bs.modal', function () {
                    $(this).remove();
                });

                $dialog.off('click.deleteRecord')
                  .on('click.deleteRecord', '.js-mc-delNotice-confirm', function (ev) {
                      var $target = $(ev.currentTarget);
                      $target.button('loading');
                      Global.sync.ajax({
                          url: '/intra/systemnotice/delnoticedetail.json',
                          data: {noticeId: id}
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
            }
        }
    });

    module.exports = NoticeManageView;
});