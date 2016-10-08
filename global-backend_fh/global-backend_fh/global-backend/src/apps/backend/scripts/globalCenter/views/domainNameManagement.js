define(function (require, exports, module) {
    var NewDomainNameView = require('globalCenter/views/newDomainName');
    require('prefab/views/searchGrid');
    var DomainNameManagementView = Base.Prefab.SearchGrid.extend({

        template: require('text!globalCenter/templates/domainNameManagement.html'),

        events: {
            'click .js-bl-del': 'delDnHandler',
            'click .js-bl-add-dn': 'newDomainNameHandler',
            'click .js-bl-operate':'domainNameOperate'
        },

        initialize: function () {
            _(this.options).extend({
                title: '域名管理',
                columns: [
                    {
                        name: '域名',
                        width: '15%'
                    },
                    {
                        name: '名称',
                        width: '15%'
                    },
                    {
                        name: '备注',
                        width: '15%'
                    },
                    {
                        name: '操作人',
                        width: '15%'
                    },
                    {
                        name: '增加时间',
                        width: '15%'
                    },
                    {
                        name: '操作',
                        width: '10%'
                    }
                ],
                pagination: false,
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/urlmng/allurls.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData).map(function (name, index) {
                return {
                    columnEls: this.formatRowData(name, index),
                    dataAttr: name
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                /*pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: false*/
            })
                .hideLoading();
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.url);
            row.push(rowInfo.name);
            row.push(rowInfo.remark);
            row.push(rowInfo.creator);
            row.push(_(rowInfo.createTime).toTime());
            row.push(this._formatOperation(rowInfo));
            return row;
        },

        _formatOperation: function (rowInfo) {
            var cell = [];
            if(rowInfo.status==0){
                cell.push('<button  type="edit" data-type="' + rowInfo.id + '" data-value="0" class="js-bl-operate btn btn-link">禁用</button><button  type="edit" data-type="' + rowInfo.id + '" class="js-bl-del btn btn-link">删除</button>');
            }else if(rowInfo.status==1){
                cell.push('<button  type="edit" data-type="' + rowInfo.id + '" data-value="1" class="js-bl-operate btn btn-link">启用</button><button  type="edit" data-type="' + rowInfo.id + '" class="js-bl-del btn btn-link">删除</button>');
            }
            return cell.join('');
        },

        delDnHandler: function (e) {
            var self=this;
            var id = this.$('.js-bl-del').data("type");
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
                            url: '/intra/urlmng/delete.json',
                            data: {urlId: id}
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
                                    $dialog.modal('hide');
                                    self._getGridXhr();
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });
        },
        //增加域名
        newDomainNameHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var $dialog = Global.ui.dialog.show(
                {
                    title: '增加域名',
                    body: '<div class="js-bl-new-dn"></div>',
                    footer: '<button class="js-bl-dn-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit" data-loading-text="保存中">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-bl-new-dn');

            var newDomainNameView = new NewDomainNameView();
            $selectContainer.html(newDomainNameView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                newDomainNameView.destroy();
            });

            $dialog.off('click.newWord')
                .on('click.newWord', '.js-bl-dn-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    var clpValidate = $dialog.find('.js-bl-domainName-form').parsley().validate();
                    if (clpValidate) {
                        $target2.button('loading');
                        //var checkType =  _.map(_.range($dialog.find('.js-bl-type:checked').length), function(num){
                        //  return $dialog.find('.js-bl-type:checked').eq(num).val();
                        //}).join(',');
                        Global.sync.ajax({
                            url: '/intra/urlmng/save.json',
                            data: {
                                urlId: 0,
                                name: $dialog.find('.js-bl-name').val(),
                                url: $dialog.find('.js-bl-url').val(),
                                remark: $dialog.find('.js-bl-remark').val()
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
        //启用/禁用域名
        domainNameOperate: function (e) {
            var self=this;
            var id = this.$('.js-bl-operate').data("type");
            var preStatus=this.$('.js-bl-operate').data("value");
            var html='';
            var status=0;
            if(preStatus==0){
                html="确认禁用此域名？";
                status=1;
            }else if(preStatus==1){
                html="确认启用此域名？";
            }
            var $dialog = Global.ui.dialog.show(
                {
                    title: '提示',
                    body: '<div class="js-bl-operate-container text-center"><p>'+html+'</p><div class="js-bl-deleteRecordNotice"></div></div>',
                    footer: '<button class="js-bl-operate-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.disableRecord')
                .on('click.disableRecord', '.js-bl-operate-confirm', function (ev) {
                    var $target = $(ev.currentTarget);
                    $target.button('loading');
                    if (id) {
                        Global.sync.ajax({
                            url: '/intra/urlmng/status.json',
                            data: {
                                urlId: id,
                                status:status
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
                                    $dialog.modal('hide');
                                    self._getGridXhr();
                                } else {
                                    Global.ui.notification.show('操作失败。');
                                }
                            });
                    }
                });
        }
    });

    module.exports = DomainNameManagementView;
});