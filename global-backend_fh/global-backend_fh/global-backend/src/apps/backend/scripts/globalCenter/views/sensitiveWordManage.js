define(function (require, exports, module) {
    var NewWordView = require('globalCenter/views/newSensitiveWord');
    require('prefab/views/searchGrid');
    var SensitiveWordManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!globalCenter/templates/sensitiveWordManage.html'),

        events: {
            'click .js-sw-del': 'delWordHandler',
            'click .js-sw-add-word': 'newWordHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '敏感词管理',
                columns: [
                    {
                        name: '敏感词',
                        width: '6%'
                    },
                    {
                        name: '分类',
                        width: '10%'
                    },
                    {
                        name: '操作人',
                        width: '6%'
                    },
                    {
                        name: '增加时间',
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
                    url: '/intra/workblacklist/getwordblacklist.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
            //判断是否已根据操作人查询
            this.creater = 0;
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.wordList).map(function (word, index) {
                return {
                    columnEls: this.formatRowData(word, index),
                    dataAttr: word
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
                self.$('.js-sw-creator').html('<option value="">全部</option>' + userData.join(''));
                this.creater = 1;
            }
        },

        formatRowData: function (rowInfo) {
            var row = [];

            row.push(rowInfo.word);
            row.push(rowInfo.type);
            row.push(_(rowInfo.createTime).toTime());
            row.push(rowInfo.createrName);
            row.push(this._formatOperation(rowInfo));

            return row;
        },

        _formatOperation: function (rowInfo) {
            var cell = [];
            cell.push('<button  type="edit" data-type="' + rowInfo.wordId + '" class="js-sw-del btn btn-link">删除</button>');


            return cell.join('');
        },
        //删除敏感词
        delWordHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var id = this.$('.js-sw-del').data("type");
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
                          url: '/intra/workblacklist/delword.json',
                          data: {wordId: id}
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
        //增加敏感词
        newWordHandler: function (e) {
            var self = this;

            var $target = $(e.currentTarget);
            var $dialog = Global.ui.dialog.show(
                {
                    title: '添加敏感词',
                    body: '<div class="js-ul-new-word"></div>',
                    footer: '<button class="js-ul-word-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="commit">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-ul-new-word');

            var newWordView = new NewWordView();
            $selectContainer.html(newWordView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                newWordView.destroy();
            });

            $dialog.off('click.newWord')
                .on('click.newWord', '.js-ul-word-confirm', function () {
                    var $target = $(e.currentTarget);
                    var clpValidate = $dialog.find('.js-sw-word-form').parsley().validate();
                    if (clpValidate) {
                        $target.button('loading');
                        Global.sync.ajax({
                            url: '/intra/workblacklist/saveword.json',
                            data: {
                                word: $dialog.find('.js-sw-word-content').val(),
                                type: _($dialog.find('.js-sw-type:checked')).map(function (type) {
                                    return $(type).val();
                                })
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

    module.exports = SensitiveWordManageView;
});