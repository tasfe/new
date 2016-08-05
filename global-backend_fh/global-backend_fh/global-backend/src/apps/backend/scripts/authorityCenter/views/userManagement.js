define(function (require, exports, module) {

    var UserModifyView = require('authorityCenter/views/userModify');

    var FundModifyView = require('authorityCenter/views/fundModify');

    require('prefab/views/searchGrid');
    var UserManagementView = Base.Prefab.SearchGrid.extend({

        template: require('text!authorityCenter/templates/userManagement.html'),

        events: {
            'click .js-um-lock': 'userLockHandler',
            'click .js-um-detail': 'showUserLogHandler',
            'click .js-um-unlock': 'userUnLockHandler',
            'click .js-um-del': 'userDelHandler',
            'click .js-um-modify': 'userModifyHandler',
            'click .js-um-fund-modify': 'fundModifyHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '用户管理',
                columns: [
                    {
                        name: '用户名',
                        width: '6%'
                    },
                    {
                        name: '所属组',
                        width: '6%'
                    },
                    {
                        name: '最后修改人',
                        width: '6%'
                    },
                    {
                        name: '最后修改时间',
                        width: '6%'
                    },
                    {
                        name: '状态',
                        width: '6%'
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
                    url: '/intra/sysusermng/userlist.json'
                }
            });
        },
        getUserGroupXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/grpmng/allgrplist.json',
                data: data
            });
        },
        onRender: function () {
            var self = this;
            var groupId = _.getUrlParam('userGroup');

            self.getUserGroupXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var groupData = _(res.root).map(function (group) {
                        return self._groupHandler(group, '');
                    });
                    var $groupId = self.$('.js-um-userGroup');
                    $groupId.html('<option value="">全部</option>' + groupData.join(''));
                    $groupId.find('option[value=' + groupId + ']').prop('selected', true);
                    Base.Prefab.SearchGrid.prototype.onRender.apply(self, arguments);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });

        },
        _groupHandler: function (groups, space) {
            var options = '<option value="' + groups.groupId + '">' + space + groups.groupName + '</option>';
            if (groups.groupList) {
                if (groups.groupList.length > 0) {
                    space += '&nbsp;&nbsp;';
                    for (var i = 0; i < groups.groupList.length; i++) {
                        options += this._groupHandler(groups.groupList[i], space);
                    }
                }
            }

            return options;
        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.userList).map(function (user, index) {
                return {
                    columnEls: this.formatRowData(user, index),
                    dataAttr: user
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
            row.push(rowInfo.groupName);
            row.push(rowInfo.operator);
            row.push(_(rowInfo.updateTime).toTime());
            if (rowInfo.status == 0) {
                row.push('<span class="control-label">正常</span>');
            }
            if (rowInfo.status == 1) {
                row.push('<span class="control-label">锁定</span>');
            }
            row.push(this._formatOperation(rowInfo));
            return row;
        },
        _formatOperation: function (rowInfo) {
            var cell = [];
            if(Global.authority.am && Global.authority.am.um && Global.authority.am.um.log && Global.authority.am.ol && Global.authority.am.ol.page){
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-um-detail btn btn-link">操作日志</button>');
            }
            if(Global.authority.am && Global.authority.am.um && Global.authority.am.um.lock){
                if (rowInfo.status == 1) {
                    cell.push('<button data-id="' + rowInfo.userId + '"  class="js-um-unlock btn btn-link">解锁</button>');
                } else {
                    cell.push('<button data-id="' + rowInfo.userId + '"  class="js-um-lock btn btn-link">锁定</button>');
                }
            }
            if(Global.authority.am && Global.authority.am.um && Global.authority.am.um.edit){
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-um-modify btn btn-link">修改</button>');
            }

            cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-um-fund-modify btn btn-link">修改资金段</button>');

            return cell.join('');
        },
        //查看操作日志
        showUserLogHandler: function (e) {
            var $target = $(e.currentTarget);
            Global.appRouter.navigate(_('#am/ol').addHrefArgs({
                _t: _.now(),
                username: $target.data('type')
            }), {trigger: true, replace: false});
        },
        //锁定用户
        userLockHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var id = $target.data("id");
            if (id) {
                Global.sync.ajax({
                    url: '/intra/sysusermng/userdisable.json',
                    data: {userId: id}
                })
                    .always(function () {
                        $target.button('submit');
                    })
                    .fail(function () {
                        // 处理失败
                    })
                    .done(function (res) {
                        if (res && res.result === 0) {
                            Global.ui.notification.show('操作成功。');
                            self._getGridXhr();
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }
        },
        //解锁用户
        userUnLockHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var id = $target.data("id");
            if (id) {
                Global.sync.ajax({
                    url: '/intra/sysusermng/userenable.json',
                    data: {userId: id}
                })
                    .always(function () {
                        $target.button('submit');
                    })
                    .fail(function () {
                        // 处理失败
                    })
                    .done(function (res) {
                        if (res && res.result === 0) {
                            Global.ui.notification.show('操作成功。');
                            self._getGridXhr();
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }
        },
        //修改用户信息
        userModifyHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '修改用户信息',
                    body: '<div class="js-um-user-modify"></div>',
                    footer: '<button class="js-ul-userModify-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button style="width: 100px;"  class="btn" data-dismiss="modal">取消</button>'

                }
            );

            var $selectContainer = $dialog.find('.js-um-user-modify');

            var userModifyView = new UserModifyView({userId: userId});
            $selectContainer.html(userModifyView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userModifyView.destroy();
            });

            $dialog.off('click.userModify')
                .on('click.userModify', '.js-ul-userModify-confirm ', function () {
                    var $target = $(e.currentTarget);
                    var type = 104;
                    var clpValidate = $dialog.find('.js-um-user-modify-form').parsley().validate();
                    if (clpValidate) {
                        $target.button('loading');
                        Global.sync.ajax({
                            url: '/intra/sysusermng/usersave.json',
                            data: {
                                userId: userId,
                                password: $dialog.find('.js-um-modify-repeatPassword ').val(),
                                groupId:$dialog.find('.js-um-modify-userGroup').val()
                            }
                        })
                            .always(function () {
                                $target.button('commit');
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
                                    Global.ui.notification.show(res.msg!=='fail'?res.msg:'操作失败。');
                                }
                            });
                    }
                });
        },

        //修改资金段
        fundModifyHandler: function(e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
              {
                  title: '修改资金段',
                  body: '<div class="js-um-fund-modify"></div>',
                  footer: '<button class="js-ul-fundModify-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button style="width: 100px;"  class="btn" data-dismiss="modal">取消</button>'
              }
            );

            var $selectContainer = $dialog.find('.js-um-fund-modify');

            var userModifyView = new FundModifyView({
                userId: userId
            });
            $selectContainer.html(userModifyView.render().el);

            var $form = $dialog.find('.js-um-fund-modify-form');

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userModifyView.destroy();
            });

            $dialog.off('click.userModify')
              .on('click.userModify', '.js-ul-fundModify-confirm ', function() {
                  var $target = $(e.currentTarget);

                  if ($form.parsley().validate()) {
                      $target.button('loading');
                      Global.sync.ajax({
                          url: '/intra/sysusermng/updateusermoneysection.json',
                          data: _(_($form.serializeArray()).serializeObject()).extend({
                              superUserId: userId
                          })
                      })
                        .always(function () {
                            $target.button('reset');
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
        }

    });

    module.exports = UserManagementView;
})
;