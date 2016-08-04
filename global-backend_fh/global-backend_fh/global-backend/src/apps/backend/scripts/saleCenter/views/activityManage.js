define(function (require, exports, module) {
    var EditActivityView = require('saleCenter/views/editActivityDetail');
    require('prefab/views/searchGrid');
    var ActivityManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/activityManage.html'),

        events: {
            'click .js-cm-show': 'showActivityHandler',
            'click .js-cm-del': 'delActivityHandler',
            'click .js-cm-edit-btn': 'openActivityEditHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '活动管理',
                columns: [
                    {
                        name: '活动名称',
                        width: '15%'
                    },
                    {
                        name: '活动类型',
                        width: '10%'
                    },
                    {
                        name: '有效期',
                        width: '15%'
                    },
                    {
                        name: '链接地址',
                        width: '15%'
                    },
                    {
                        name: '状态',
                        width: '5%'
                    },
                    {
                        name: '操作人',
                        width: '5%'
                    },
                    {
                        name: '操作',
                        width: '12%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/activitymanage/getactivitylist.json'
                }
            });
        },
        getActivityDelXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/getactivitydetail.json',
                data:data
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            //判断是否已根据操作人查询
            this.creater = 0;

        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.activityList).map(function (activity, index) {
                return {
                    columnEls: this.formatRowData(activity, index),
                    dataAttr: activity
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
                self.$('.js-cm-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.title);
            if (_.isEmpty(rowInfo.type)) {
                if (rowInfo.type == 1) {
                    row.push('<div class="text-center">日常活动</div>');
                }
                if (rowInfo.type == 2) {
                    row.push('<div class="text-center">大型活动</div>');
                }
            }
            row.push('<br>' + _(rowInfo.startTime).toTime() + '</br><br>' + _(rowInfo.endTime).toTime() + '</br>');
            row.push(rowInfo.actUrl);
            row.push(rowInfo.createrName);
            if (_.isEmpty(rowInfo.isDel)) {
                if (rowInfo.isDel == 0) {
                    if (_.isEmpty(rowInfo.actStatus)) {
                        if (rowInfo.actStatus == 0) {
                            row.push('<div class="text-center">未开始</div>');
                        }
                        if (rowInfo.actStatus == 1) {
                            row.push('<div class="text-center">进行中</div>');
                        }
                        if (rowInfo.actStatus == 2) {
                            row.push('<div class="text-center">已过期</div>');
                        }
                    }
                }
                if (rowInfo.isDel == 1) {
                    row.push('<div class="text-center">已删除</div>');
                }
            }
            row.push(this._formatOperation(rowInfo));
            return row;
        },

        _formatOperation: function (rowInfo) {
            var cell = [];
            if (_.isEmpty(rowInfo.isDel)) {
                if (rowInfo.isDel == 0) {
                    if (_.isEmpty(rowInfo.actStatus)) {
                        if (rowInfo.actStatus == 0 || rowInfo.actStatus == 1||rowInfo.actStatus == 2) {
                            cell.push('<button data-type="' + rowInfo.actId + '" class="js-cm-show btn btn-link">查看</button>');
                            cell.push('<button  type="delete" data-type="' + rowInfo.actId + '" class="js-cm-edit-btn btn btn-link">编辑</button>');
                            cell.push('<button  type="edit" data-type="' + rowInfo.actId + '" class="js-cm-del btn btn-link">删除</button>');
                        }
                        /*if (rowInfo.actStatus == 2) {
                            cell.push('<button data-type="' + rowInfo.actId + '" class="js-cm-show btn btn-link">查看</button>');
                        }*/
                    }
                }
                if (rowInfo.isDel == 1) {
                    cell.push('<button data-type="' + rowInfo.actId + '" class="js-cm-show btn btn-link">查看</button>');
                }
            }
            return cell.join('');
        },
        //显示活动详情
        showActivityHandler: function(e){
            var $target = $(e.currentTarget);
            var size = this.$('.js-cm-show').val();
            this.getActivityDelXhr({actId: $target.data('type')}).done(function(res){
                    var $dialog = Global.ui.dialog.show(
                        {
                            title: '效果图',
                            body: '<div class="ad">' +
                            '<a class="ad-link" href="' + res.root.bannerUrl + '" target="_blank">' +
                            '<div class="ad-img"><img src="' + res.root.bannerPicUrl + '"></div>' +
                            '</a>' +
                            '</div>',
                            footer: '<div class="ad-footer col-sm-5 text-left">' +
                            '<span class="ad-title">"' + res.root.activityTitle + '"</span>' +
                            '</div>' +
                            '<div class="col-sm-7">' +
                            '<span class="ad-option">活动时间： "' + _(res.root.activityBegin).toDate() + '" 至 "' + _(res.root.activityStop).toDate() + '"</span>' +
                            '</div>'
                        }
                    );
                $dialog.on('hidden.bs.modal', function (e) {
                    $(this).remove();
                });

            });
        },
        //删除活动详情
        delActivityHandler: function (e) {
            var self=this;
            var $target = $(e.currentTarget);
            var id =  $target.data('type');
            var html = '<p>确定删除？</p>';
            var $dialog = Global.ui.dialog.show(
              {
                  title: '提示',
                  body: '<div class="js-bl-deleteRecord-container text-center"><p>确认删除此记录？</p><div class="js-bl-deleteRecordNotice"></div></div>',
                  footer: '<button class="js-bl-deleteRecord-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
              }
            );

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.deleteRecord')
              .on('click.deleteRecord', '.js-bl-deleteRecord-confirm', function (ev) {
                  var $target = $(ev.currentTarget);
                  $target.button('loading');
                  if (id) {
                      Global.sync.ajax({
                          url: '/intra/activitymanage/delactivity.json',
                          data: {actId: id}
                      })
                        .always(function () {
                            $target.button('delete');
                        })
                        .fail(function () {
                            // 处理失败
                        })
                        .done(function (res) {
                            if (res && res.result === 0) {
                                Global.ui.notification.show('操作成功');
                                $dialog.modal('hide');
                                self._getGridXhr();
                            } else {
                                Global.ui.notification.show('操作失败。');
                            }
                        });
                  }
              });
        },
        //编辑活动详情
        openActivityEditHandler: function(e) {
            var self=this;
            var $target = $(e.currentTarget);
            var size = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '编辑活动',
                    body: '<div class="js-il-edit-Activity"></div>',
                    footer: '<button class="js-il-edit-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-il-edit-Activity');

            var editActivityView = new EditActivityView({actId:size});
            $selectContainer.html(editActivityView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

            $dialog.off('click.editActivity')
                .on('click.editActivity', '.js-il-edit-confirm', function (ev) {
                  var $target2 = $(ev.currentTarget);
                  if(_($dialog.find('.js-wt-img-attach')).size()===0){
                      editActivityView.insertNotice('请先上传图片。');
                      return false;
                  }else if(_($dialog.find('.js-wt-img-attach')).size()>1){
                      editActivityView.insertNotice('仅允许上传一张图片。');
                      return false;
                  }
                  $target2.button('loading');
                  var clpValidate = $dialog.find('.js-cm-edit-form').parsley().validate();
                  if (clpValidate) {
                      editActivityView.updateActivityHandle().always(function(){
                          $target.button('reset');
                      }).fail(function () {
                      }).done(function (res) {
                          if (res && res.result === 0) {
                              self._getGridXhr();
                              $dialog.modal('hide');
                              Global.ui.notification.show('操作成功。');
                          } else {
                              Global.ui.notification.show('操作失败。');
                          }
                      });
                      //self.renderSendUsers(self.selectedList);
                  }else{
                      $target.button('reset');
                  }
                });

        }
    });
    module.exports = ActivityManageView;
});