define(function (require, exports, module) {
    var ShowBulletinDetailView = require('messageCenter/views/bulletin-ShowBulletinDetail');
    var EditBulletin = require('messageCenter/views/bulletin-EditBulletin');
    require('prefab/views/searchGrid');
    var BulletinManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!messageCenter/templates/bulletin-BulletinManage.html'),

        events: {
            'click .js-nm-show': 'showBulletinHandler',
            'click .js-nm-edit-btn': 'editBulletinHandler',
            'click .js-nm-del': 'delBulletinHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '公告管理',
                columns: [
                    {
                        name: '主题',
                        width: '20%'
                    },
                    {
                        name: '公告类型',
                        width: '10%'
                    },
                    {
                        name: '发布时间',
                        width: '15%'
                    },
                    {
                        name: '操作人',
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
                    url: '/intra/bulletinmanage/getbulletlist.json'
                }
            });
        },
        getBulletinDelXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/bulletinmanage/getbulletindetail.json',
                data: data
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-nm-timeset'),
                startTime: 'startTime',
                endTime: 'endTime'
            }).render();

            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            //判断是否已根据操作人查询
            this.creater = 0;
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.bullentList).map(function (bullent, index) {
                return {
                    columnEls: this.formatRowData(bullent, index),
                    dataAttr: bullent
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
                self.$('.js-nm-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.title);

            if (!rowInfo.isUrgent) {
                if (rowInfo.isUrgent == 0) {
                    row.push("普通");
                }
            }
            if (rowInfo.isUrgent && rowInfo.isUrgent == 1) {
                row.push("紧急");
            }
            row.push(_(rowInfo.onlineTime).toTime());
            row.push(rowInfo.createrName);
            row.push(this._formatOperation(rowInfo));

            return row;
        },

        _formatOperation: function (rowInfo) {
            var cell = [];
            if (_.isEmpty(rowInfo.isDel)) {
                if (rowInfo.isDel == 0) {
                    if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.view) {
                        cell.push('<button data-type="' + rowInfo.bulletinId + '" class="js-nm-show btn btn-link">查看</button>');
                    }
                    if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.edit) {
                        cell.push('<button  type="delete" data-type="' + rowInfo.bulletinId + '" class="js-nm-edit-btn btn btn-link">编辑</button>');
                    }
                    if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.del) {
                        cell.push('<button  type="edit" data-type="' + rowInfo.bulletinId + '" class="js-nm-del btn btn-link">删除</button>');
                    }
                }
                if (rowInfo.isDel == 1) {
                    if (Global.authority.mc && Global.authority.mc.nw && Global.authority.mc.nw.view) {
                        cell.push('<button data-type="' + rowInfo.bulletinId + '" class="js-nm-show btn btn-link">查看</button>');
                    }
                }
            }
            return cell.join('');
        }
        ,
        //显示公告详情
        showBulletinHandler: function (e) {
            var $target = $(e.currentTarget);
            var size = $target.data("type");
            this.getBulletinDelXhr({bulletinId: size}).done(function (res) {
                if (res && res.result === 0) {
                    var sta;
                    var offline;
                    if(res.root.isUrgent == 0){
                        sta="普通";
                        offline=""
                    }
                    if(res.root.isUrgent == 1){
                        sta="紧急";
                        offline='<div class="col-sm-12 text-left">' +
                            '<span class="ad-option">过期时间： "' + _(res.root.offlineTime).toDate()+'"</span>' +
                            '</div>'
                    }

                    var $dialog = Global.ui.dialog.show(
                        {
                            size: 'modal-lg',
                            title: '效果图',
                            body: '<div class="ad">' +
                            '<div>'+res.root.content+'</div>' +
                            '</div>',
                            footer: '<div class="row"><div class="ad-footer col-sm-8 text-left">' +
                            '<span class="ad-title">主&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题："' + res.root.title + '"</span>' +
                            '</div>' +
                            '<div class="col-sm-4 text-left">' +
                            '<span class="ad-option">状&nbsp;&nbsp;&nbsp;态："'+sta+'"</span>' +
                            '</div>' +
                            '<div class="ad-footer col-sm-8 text-left">' +
                            '<span class="ad-option">发布时间： "' + _(res.root.onlineTime).toDate()+'"</span>' +
                            '</div>' +
                            '<div class="col-sm-4 text-left">' +
                            '<span class="ad-option">发布人："' + res.root.createrName + '"</span>' +
                            '</div>' +offline+
                            '</div>'

                        }
                    );

                }
                $dialog.on('hidden.bs.modal', function (e) {
                    $(this).remove();
                });

            });
        }
        ,
        //编辑公告详情
        editBulletinHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var id = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    title: '编辑公告',
                    body: '<div class="js-il-edit-Bulletin"></div>',
                    footer: '<button class="js-il-editBulletin-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-il-edit-Bulletin');

            var editBulletinView = new EditBulletin({bulletinId: id});
            $selectContainer.html(editBulletinView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                editBulletinView.destroy();
            });

            $dialog.off('click.editBulletin')
                .on('click.editBulletin', '.js-il-editBulletin-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var clpValidate = $dialog.find('.js-nm-edit-form').parsley().validate();
                    var endTime;
                    if ($dialog.find('.js-nm-type').data("type") == 1) {
                        endTime = _($dialog.find('.js-nm-endtime').val()).toTime();
                    }
                    if (clpValidate) {
                        $target2.button('loading');
                        var userLevel = [];
                        _($dialog.find('.js-pf-userLevel')).map(function(item){
                            if($(item).prop('checked')){
                                userLevel.push( $(item).val());
                            }
                        });
                        Global.sync.ajax({
                            url: '/intra/newbullet/modifybulletin.json',
                            data: {
                                content: $dialog.find('.js-nm-edit-content').val(),
                                onlineTime: _($dialog.find('.js-nm-edit-starttime').val()).toTime(),
                                title: $dialog.find('.js-nm-edit-title').val(),
                                offlineTime: endTime,
                                bulletinId: id,
                                isUrgent: $dialog.find('.js-nm-type').data("type"),
                                desc:$dialog.find('.js-nm-edit-desc').val(),
                                userLevel: userLevel.join(',')
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
        //删除公告详情
        delBulletinHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var id = $target.data("type");
            if (id) {

                var self = this;
                var $dialog = Global.ui.dialog.show(
                  {
                      title: '提示',
                      body: '<div class="text-center" ><p>确认删除此公告？</p></div>',
                      footer: '<button class="js-mc-delBulletin-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                  }
                );
                $target.button('reset');

                $dialog.on('hidden.bs.modal', function () {
                    $(this).remove();
                });

                $dialog.off('click.deleteRecord')
                  .on('click.deleteRecord', '.js-mc-delBulletin-confirm', function (ev) {
                      var $target = $(ev.currentTarget);
                      $target.button('loading');
                      Global.sync.ajax({
                          url: '/intra/bulletinmanage/delbulletin.json',
                          data: {bulletinId: id}
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

    module.exports = BulletinManageView;
});