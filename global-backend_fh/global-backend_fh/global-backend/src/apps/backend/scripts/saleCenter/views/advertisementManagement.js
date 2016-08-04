define(function (require, exports, module) {
    var EditAdvertiseView = require('saleCenter/views/editAdvertisementDetail');
    require('prefab/views/searchGrid');

    var AdvertisementManagementView = Base.Prefab.SearchGrid.extend({

        template: require('text!saleCenter/templates/advertisementManagement.html'),

        events: {
            'click .js-ac-del': 'delAdvertiseHandler',
            'click .js-ac-show': 'showAdvertiseHandler',
            'click .js-ac-editAdvertise-btn': 'openAdvertiseEditHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '广告管理',
                columns: [
                    {
                        name: '广告名称',
                        width: '15%'
                    },
                    {
                        name: '广告位置',
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
                        name: '前台显示排序',
                        width: '5%'
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
                    url: '/intra/advertisemanage/getadvertiselist.json'
                }

            });
        },
        getPlaceXhr: function () {
            return Global.sync.ajax({
                url: '/intra/advertisemanage/getadvertiseplacelist.json'
            });
        },
        getAdvertisementDelXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/advertisemanage/getadvertisedetail.json',
                data: data
            });
        },
        openAdvertiseEditXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/advertisemanage/getadvertisedetail.json',
                data: data
            });
        },
        onRender: function () {
            var self = this;
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            this.getPlaceXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var placeData = _(res.root.placeList).map(function (place) {
                        return '<option value="' + place.placeId + '">' + place.placeName + '</option>';
                    });
                    self.$('.js-am-place').html('<option value="">全部</option>' + placeData.join(''));
                    self.$('.js-ca-arManageUpload-btn').upload({
                        done: function (res) {
                            //显示图片
                            self.generateImageArea(res.root);
                        },
                        fail: function () {
                            Global.ui.notification.show('数据异常。');
                        }
                    });
                } else {
                    Global.ui.notification.show('数据异常。');
                }

            })
            this.creater = 0;
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.advertiseList).map(function (advertise, index) {
                return {
                    columnEls: this.formatRowData(advertise, index),
                    dataAttr: advertise
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
                self.$('.js-am-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.name);
            row.push(rowInfo.placeName);
            row.push('<br>' + _(rowInfo.startTime).toTime() + '</br><br>' + _(rowInfo.endTime).toTime() + '</br>');
            row.push(rowInfo.url);
            row.push(rowInfo.sort);
            if (_.isEmpty(rowInfo.isDel)) {
                if (rowInfo.isDel == 0) {
                    if (_.isEmpty(rowInfo.placeType)) {
                        if (rowInfo.placeType == 1) {
                            row.push('<div class="text-center">未开始</div>');
                        }
                        if (rowInfo.placeType == 2) {
                            row.push('<div class="text-center">进行中</div>');
                        }
                        if (rowInfo.placeType == 3) {
                            row.push('<div class="text-center">已过期</div>');
                        }
                    }
                }
                if (rowInfo.isDel == 1) {
                    row.push('<div class="text-center">已删除</div>');
                }
            }
            row.push(rowInfo.createrName);
            row.push(this._formatOperation(rowInfo));
            return row;
        },

        _formatOperation: function (rowInfo) {
            var cell = [];
            if (_.isEmpty(rowInfo.isDel)) {
                if (rowInfo.isDel == 0) {
                    if (_.isEmpty(rowInfo.placeType)) {
                        if (rowInfo.placeType == 1 || rowInfo.placeType == 2) {
                            if (Global.authority.sc && Global.authority.sc.am && Global.authority.sc.am.view) {
                                cell.push('<button data-type="' + rowInfo.advId + '" class="js-ac-show btn btn-link">查看</button>');
                            }
                            if (Global.authority.sc && Global.authority.sc.am && Global.authority.sc.am.edit) {
                                cell.push('<button  type="delete" data-type="' + rowInfo.advId + '" class="js-ac-editAdvertise-btn btn btn-link">编辑</button>');
                            }
                            if (Global.authority.sc && Global.authority.sc.am && Global.authority.sc.am.del) {
                                cell.push('<button  type="edit" data-type="' + rowInfo.advId + '" class="js-ac-del btn btn-link">删除</button>');
                            }
                        }
                        if (rowInfo.placeType == 3) {
                            if (Global.authority.sc && Global.authority.sc.am && Global.authority.sc.am.view) {
                                cell.push('<button data-type="' + rowInfo.advId + '" class="js-ac-show btn btn-link">查看</button>');
                            }
                        }
                    }
                }
                if (rowInfo.isDel == 1) {
                    if (Global.authority.sc && Global.authority.sc.am && Global.authority.sc.am.view) {
                        cell.push('<button data-type="' + rowInfo.advId + '" class="js-ac-show btn btn-link">查看</button>');
                    }
                }
            }
            return cell.join('');
        },

        //显示广告详情
        showAdvertiseHandler: function (e) {
            var $target = $(e.currentTarget);
            var size = this.$('.js-ac-show').val();
            this.getAdvertisementDelXhr({advId: $target.data('type')}).done(function (res) {
                var $dialog = Global.ui.dialog.show(
                    {
                        title: '效果图',
                        body: '<div class="ad">' +
                        '<a class="ad-link" href="' + res.root.advUrl + '" target="_blank">' +
                        '<div class="ad-img"><img src="' + res.root.picUrl + '"></div>' +
                        '</a>' +
                        '</div>',
                        footer: '<div class="ad-footer col-sm-5 text-left">' +
                        '<span class="ad-title">"' + res.root.advName + '"</span>' +
                        '</div>' +
                        '<div class="col-sm-7">' +
                        '<span class="ad-option">活动时间： "' + _(res.root.startTime).toDate() + '" 至 "' + _(res.root.endTime).toDate() + '"</span>' +
                        '</div>'
                    }
                );

                $dialog.on('hidden.bs.modal', function (e) {
                    $(this).remove();
                });

            });
        },
        //删除广告详情
        delAdvertiseHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var id = $target.data('type');
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
                          url: '/intra/advertisemanage/deladvertise.json',
                          data: {advId: id}
                      })
                        .always(function () {
                            $target.button('delete');
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
        //编辑广告详情
        openAdvertiseEditHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var size = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '编辑广告',
                    body: '<div class="js-il-edit-Advertise"></div>',
                    footer: '<button class="js-il-edit-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-il-edit-Advertise');

            var editAdvertiseView = new EditAdvertiseView({aId: size});
            $selectContainer.html(editAdvertiseView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
            });

            $dialog.off('click.editAdvertise')
                .on('click.editAdvertise', '.js-il-edit-confirm', function (ev) {
                    var $target2 = $(ev.currentTarget);
                    if (_($dialog.find('.js-wt-img-attach')).size() === 0) {
                        editAdvertiseView.insertNotice('请先上传图片。');
                        return false;
                    } else if (_($dialog.find('.js-wt-img-attach')).size() > 1) {
                        editAdvertiseView.insertNotice('仅允许上传一张图片。');
                        return false;
                    }
                    $target2.button('loading');
                    var clpValidate = $dialog.find('.js-am-editAdvertise-form').parsley().validate();
                    if (clpValidate) {
                        editAdvertiseView.updateAdvertisementHandle().always(function () {
                            $target2.button('reset');
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
                    } else {
                        $target2.button('reset');
                    }
                });

        }
    });

    module.exports = AdvertisementManagementView;
});