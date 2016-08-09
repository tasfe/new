define(function (require, exports, module) {
    var EditUserRebateView = require('userCenter/views/user-userRebate');
    var UserDisableView = require('userCenter/views/user-userDisable');
    var UserEnableView = require('userCenter/views/user-userEnable');
    var UserRecoverView = require('userCenter/views/user-userRecover');
    var UserResetView = require('userCenter/views/user-userReset');
    require('prefab/views/searchGrid');
    var UserListView = Base.Prefab.SearchGrid.extend({

        template: require('text!userCenter/templates/user-userList.html'),

        events: {
            'click .js-ul-show': 'showUserDetailHandler',
            'click .js-ul-rebate': 'editUserRebateHandler',
            'click .js-ul-disable': 'disableUserHandler',
            'click .js-ul-enable': 'enableUserHandler',
            'click .js-ul-recover': 'recoverUserHandler',
            'click .js-ul-reset':'resetUserHandler',
            'click .js-ul-account':'userAccountHandler',
            'click .js-ul-chase':'userChaseHandler',
            'click .js-ul-bet':'userBetHandler',
            'click .js-ul-allLevel': 'selectAllLevelHandler'
        },
        initialize: function () {

            _(this.options).extend({
                title: '用户列表',
                columns: [
                    {
                        name: '用户名',
                        width: '10%'
                    },
                    {
                        name: '用户等级',
                        width: '5%'
                    },
                    {
                        name: '用户组',
                        width: '6%'
                    },
                    {
                        name: '返点',
                        width: '6%'
                    },
                    {
                        name: '个人余额',
                        width: '6%',
                        sortable: true,
                        id: 3
                    },
                    {
                        name: '注册时间',
                        width: '12%',
                        sortable: true,
                        id: 4
                    },
                    {
                        name: '不活跃天数<i class="js-ul-uDays fa fa-question-circle font-14 cursor-pointer"></i>',
                        width: '3%',
                        sortable: true,
                        id: 5
                    },
                    {
                        name: '总配额',
                        width: '3%',
                        sortable: true,
                        id: 6
                    },
                    {
                        name: '剩余配额',
                        width: '3%',
                        sortable: true,
                        id: 7
                    },
                    {
                        name: '操作',
                        width: '18%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/usermanager/getalluserlist.json'
                },
                subOps: {
                    data: ['userParentId']
                },
                breadUseSearch: false,
                breadResetSearch: false,
                sameNameFormat: true
            });
        },
        getUserRebateXhr: function () {
            return Global.sync.ajax({
                url: '/intra/usermanager/getuserquota.json'
            });
        },
        onRender: function () {
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-ul-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                strDefaultValue: '2012-01-01 0:00:00',
                endDefaultValue: moment().format('YYYY-MM-DD')+ ' 23:59:59',
            }).render();
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);

        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.userList).map(function (userInfo, index) {
                return {
                    columnEls: this.formatRowData(userInfo, index),
                    dataAttr: userInfo
                };
            }, this);

            if (!_(gridData.parents).isEmpty()) {
                this._breadList = _(gridData.parents).map(function(parent, index) {
                    return {
                        data: {
                            userParentId: parent.userId
                        },
                        label: parent.userName
                    };
                });
                this.renderBread();
            }

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            })
                .hideLoading();
            //初始化不活跃天数说明
            this.$('.js-ul-uDays').popover({
                trigger: 'hover',
                title: '不活跃天数定义',
                content: '连续多少天内无任何账变，即为不活跃的天数',
                placement: 'bottom'
            });
        },

        formatRowData: function (rowInfo) {
            var row = [];
            if (rowInfo.userStatus == 100 || rowInfo.userStatus == 101 || rowInfo.userStatus == 103) {
                if (rowInfo.subNum) {
                    var userDetail  = '<a class="js-pf-sub" data-not-auto-render="true" data-label="' + rowInfo.username +
                          '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
                          rowInfo.username + '</a>';
                    if (rowInfo.userStatus == 100 || rowInfo.userStatus == 101) {
                        row.push( userDetail +'(' + rowInfo.subNum + ')' + '&nbsp;&nbsp;<span class="label label-warning">冻</span>');
                    }
                    if (rowInfo.userStatus == 103) {
                        row.push(userDetail+'(' + rowInfo.subNum + ')' + '&nbsp;&nbsp;<span class="label label-danger">回收</span>');
                    }
                } else {
                    if (rowInfo.userStatus == 100 || rowInfo.userStatus == 101) {
                        row.push(rowInfo.username + '&nbsp;&nbsp;<span class="label label-warning">冻</span>');
                    }
                    if (rowInfo.userStatus == 103) {
                        row.push(rowInfo.username + '&nbsp;&nbsp;<span class="label label-danger">回收</span>');
                    }
                }
            } else {
                if (rowInfo.subNum) {
                    row.push('<a class="js-pf-sub" data-label="' + rowInfo.username +
                        '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
                        rowInfo.username + '</a> (' + rowInfo.subNum + ')');
                } else {
                    row.push(rowInfo.username);
                }
            }
            row.push('V'+rowInfo.userLevel);
            row.push(rowInfo.userGroup);
            row.push(_(rowInfo.rebate).formatDiv(10) + '%');
            row.push(_(rowInfo.balance).formatDiv(10000, {fixed: 4}));
            row.push(_(rowInfo.regTime).toTime());
            row.push(rowInfo.uDays);
            row.push(rowInfo.quotaTotal);
            row.push(rowInfo.quotaLave);
            row.push(this._formatOperation(rowInfo));
            return row;
        },
        _formatOperation: function (rowInfo) {
            var cell = [];
            if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.detail) {
                cell.push('<a href="' + _.getUrl('/detail/' + rowInfo.userId, {'name': rowInfo.username,'rightTag': '1'}) + '" class="router btn btn-link">详情</a>');
            }
            if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.freeze) {
                if (rowInfo.userStatus == 100 || rowInfo.userStatus == 101) {
                    cell.push('<button type="button" data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-enable btn btn-link">解冻</button>');
                } else {
                    cell.push('<button type="button" data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-disable btn btn-link">冻结</button>');
                }
            }
            if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.quota) {
                if (_(rowInfo.rebate) > 126 ) {
                    cell.push('<button  type="delete" data-type="' + rowInfo.userId + '" class="js-ul-rebate btn btn-link">配额</button>');
                }
            }
            if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.recycle) {
                if (_(rowInfo.userStatus) != 103) {
                    cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-recover btn btn-link">回收</button>');
                }
            }
            if(Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.reset) {
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-reset btn btn-link">申述</button>');
            }
            if(Global.authority.bc && Global.authority.bc.br && Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.bet) {
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-bet btn btn-link">投注</button>');
            }
            if(Global.authority.bc && Global.authority.bc.cr && Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.chase) {
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-chase btn btn-link">追号</button>');
            }
            if(Global.authority.fc && Global.authority.fc.ad && Global.authority.fc.ad.page && Global.authority.uc && Global.authority.uc.ul && Global.authority.uc.ul.accountDetail) {
                cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.username + '" class="js-ul-account btn btn-link">帐变</button>');
            }
            return cell.join('');
        },
        //编辑用户配额详情
        editUserRebateHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var size = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    bStyle:'width: 700px;',
                    title: '修改配额',
                    body: '<div class="js-ul-edit-rebate"></div>',
                    footer: '<button class="js-ul-editRebate-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-edit-rebate');

            var editUserRebateView = new EditUserRebateView({userId: size});
            $selectContainer.html(editUserRebateView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                editUserRebateView.destroy();
            });

            $dialog.off('click.editRebate')
                .on('click.editRebate', '.js-ul-editRebate-confirm', function (ev) {
                var $currContainer = $dialog.find('.js-ul-edit-form');
                var clpValidate = $currContainer.parsley().validate();
                if (clpValidate) {
                      var $target2 = $(ev.currentTarget);
                      $target2.button('loading');
                      return Global.sync.ajax({
                          url: '/intra/usermanager/saveuserquota.json',
                          data: {
                              quota: _($dialog.find('.js-uc-quotaId')).map(function (quota, index, quotaList) {
                                  return {
                                      quotaId: $(quota).data('id'),
                                      quotaChange: $($dialog.find('.js-uc-quotaLave')[index]).val(),
                                      quotaLevel: $(quota).data('level')
                                  }
                              }),

                              userId: size
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
        //冻结用户
        disableUserHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '冻结用户',
                    body: '<div class="js-ul-user-disable"></div>',
                    footer: '<button class="js-ul-userDisable-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-user-disable');

            var userDisableView = new UserDisableView({userId: userId, name: name});
            $selectContainer.html(userDisableView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userDisableView.destroy();
            });

            $dialog.off('click.userDisable')
                .on('click.userDisable', '.js-ul-userDisable-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var clpValidate = $dialog.find('.js-ul-disabled-form').parsley().validate();
                    if (clpValidate) {
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/usermanager/usermanage.json',
                            data: {
                                userId: userId,
                                Reason: $dialog.find('.js-ul-disable-reson').val(),
                                type: $dialog.find('.js-ul-disable-type:checked').val(),
                                range: $dialog.find('.js-ul-disable-range:checked').val()
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
        //解冻用户
        enableUserHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '解冻用户',
                    body: '<div class="js-ul-user-enable"></div>',
                    footer: '<button class="js-ul-userEnable-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-user-enable');

            var userEnableView = new UserEnableView({userId: userId, name: name});
            $selectContainer.html(userEnableView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userEnableView.destroy();
            });

            $dialog.off('click.userEnable')
                .on('click.userEnable', '.js-ul-userEnable-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var type = 102;
                    var clpValidate = $dialog.find('.js-ul-enabled-form').parsley().validate();
                    if (clpValidate) {
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/usermanager/usermanage.json',
                            data: {
                                userId: userId,
                                Reason: $dialog.find('.js-ul-enable-reson').val(),
                                type: type,
                                range: $dialog.find('.js-ul-enable-range:checked').val()
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
        //回收用户
        recoverUserHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '回收用户',
                    body: '<div class="js-ul-user-recover"></div>',
                    footer: '<button class="js-ul-userRecover-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-user-recover');

            var userRecoverView = new UserRecoverView({userId: userId, name: name});
            $selectContainer.html(userRecoverView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userRecoverView.destroy();
            });

            $dialog.off('click.userRecover')
                .on('click.userRecover', '.js-ul-userRecover-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var type = 103;
                    var clpValidate = $dialog.find('.js-ul-recover-form').parsley().validate();
                    if (clpValidate) {
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/usermanager/userrecover.json',
                            data: {
                                userId: userId,
                                Reason: $dialog.find('.js-ul-recover-reson').val(),
                                type: type,
                                addQuota: $dialog.find('.js-uc-ur-addQuota').val()==='0'?'0':'1'
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
        //用户申訴（重置）
        resetUserHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var userId = $target.data('id');
            var name = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '重置用户',
                    body: '<div class="js-ul-user-reset"></div>',
                    footer: '<button class="js-ul-userReset-confirm btn btn-primary" style="width: 100px; margin-right: 20px;" type="commit">确定</button><button class="btn" style="width: 100px;" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-user-reset');

            var userResetView = new UserResetView({userId: userId, name: name});
            $selectContainer.html(userResetView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                userResetView.destroy();
            });

            $dialog.off('click.userReset')
                .on('click.userReset', '.js-ul-userReset-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var type = 104;
                    var clpValidate = $dialog.find('.js-ul-reset-form').parsley().validate();
                    if (clpValidate) {
                        $target2.button('loading');
                        Global.sync.ajax({
                            url: '/intra/usermanager/userreset.json',
                            data: {
                                resetUserId : userId,
                                Reason: $dialog.find('.js-ul-reset-reson').val(),
                                manageType: type,
                               // _(this.$('.js-sp-group:checked')).map(function (type)
                                typeList: _($dialog.find('.js-ul-typelist:checked')).map(function (type, index, typelist) {
                                    return $(type).val();
                                    //return $($dialog.find('.js-ul-typelist')[index]).val()
                                })
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
        userAccountHandler:function(e){
            var $target = $(e.currentTarget);
            Global.appRouter.navigate(_('#fc/ad').addHrefArgs({
                _t:_.now(),
                username:$target.data('type')
            }), {trigger: true, replace: false});
        },
        userChaseHandler:function(e){
            var $target = $(e.currentTarget);
            Global.appRouter.navigate(_('#bc/cr').addHrefArgs({
                _t:_.now(),
                username:$target.data('type')
            }), {trigger: true, replace: false});
        },
        userBetHandler:function(e){
            var $target = $(e.currentTarget);
            Global.appRouter.navigate(_('#bc/br').addHrefArgs({
                _t:_.now(),
                username:$target.data('type')
            }), {trigger: true, replace: false});
        },
        selectAllLevelHandler: function(){
            var $target = this.$('.js-ul-allLevel');
            var checked = $target.prop('checked');
            if(checked){

                _(this.$('.js-ul-userLevel')).each(function (item) {
                    $(item).prop('checked',true);
                });
            }else{
                _(this.$('.js-ul-userLevel')).each(function (item) {
                    $(item).prop('checked',false);
                });
            }
        }
    });

    module.exports = UserListView;
});
//56250