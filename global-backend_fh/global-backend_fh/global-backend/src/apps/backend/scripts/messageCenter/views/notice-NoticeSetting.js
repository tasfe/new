define(function (require, exports, module) {
    var EditTempleteView = require('messageCenter/views/notice-EditTemplete');
    var NoticeSettingView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/notice-NoticeSetting.html'),

        events: {
            'click .js-pt-editTem': 'editNoticeTemHandler',
            'click .js-pt-editSend': 'editNoticeStatusHandler'
        },

        initialize: function () {
        },
        onRender: function () {
            var self = this;
            this._getNoticeSetData().done(function (res) {
                if (res.result === 0) {
                    self._getTable(self._formatSendType(self._formatRowData(res.root)), 'js-mc-ns-table-container');
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            }).fail(function () {
            });
        },
        //发送请求
        _getNoticeSetData: function () {
            return Global.sync.ajax({
                url: '/intra/systemnotice/getnoticeconf.json'
            });
        },
        //获取表格
        _getTable: function (tableInfo, classValue) {
            this.$('.' + classValue).staticGrid({
                colModel: [
                    {label: '任务类型', name: 'noticeType', merge: true, width: 100},
                    {label: '任务名称', name: 'noticeName', merge: true, width: 120},
                    {label: '发送方式', name: 'sendTypeName', width: 130},
                    {label: '操作', name: 'operation', width: 130}
                ],
                row: tableInfo
            });
        },
        //格式化数据
        _formatRowData: function (types) {
            return _(types).chain().map(function (type) {
                var typeName = type.typeName;
                var confs = type.confList;
                return _(confs).map(function (conf) {
                    var confName = conf.confName;
                    var confId = conf.confId;
                    var temId = conf.temId;
                    var isDel = conf.isDel;
                    return {
                        'noticeType': typeName,
                        'noticeName': confName,
                        'temId': temId,
                        'confId': confId,
                        'isDel': isDel,
                        'sTypes': conf.stList
                    };
                });
            }).flatten().value();
        },

        _formatSendType: function (confs) {
            var self = this;
            return _(confs).chain().map(function (conf) {
                return {
                    'noticeType': conf.noticeType,
                    'noticeName': conf.noticeName,
                    'sendTypeName': self._formatSendTypeChoose(conf.sTypes),
                    'operation': self._formatOperation(conf.temId, conf.confId, conf.noticeName, conf.isDel)
                };
            }).flatten().value();
        },
        _formatSendTypeChoose: function (sTypes) {
            var cell = [];
            _(sTypes).each(function (type) {
                cell.push('<input type="checkbox" value="' + type.sendType + '" name="sendType" class="js-pt-type" checked disabled>&nbsp;&nbsp;' + type.sendTypeName);
            });
            return cell.join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        },
        _formatOperation: function (temId, confId, confName, isDel) {
            var cell = [];
            if (isDel == 0) {
                if(Global.authority.mc && Global.authority.mc.pt && Global.authority.mc.pt.disable){
                    cell.push('<button data-id="' + confId + '"  data-type="1" class="js-pt-editSend btn btn-link">禁用</button>');
                }
            }
            if (isDel == 1) {
                if(Global.authority.mc && Global.authority.mc.pt && Global.authority.mc.pt.disable){
                    cell.push('<button data-id="' + confId + '"   data-type="0" class="js-pt-editSend btn btn-link">启用</button>');
                }
            }
            if(Global.authority.mc && Global.authority.mc.pt && Global.authority.mc.pt.edit){
                cell.push('<button data-id="' + confId + '" data-name="' + confName + '" data-type="1" class="js-pt-editTem btn btn-link">编辑系统通知模板</button>');
            }
            //if(Global.authority.mc && Global.authority.mc.pt && Global.authority.mc.pt.edit){
                if(_([1,2,3,9]).contains(confId)){
                    cell.push('<button data-id="' + confId + '" data-name="' + confName + '" data-type="3" class="js-pt-editTem btn btn-link">编辑桌面通知模板</button>');
                }
            //}
            return cell.join('');
        },
        //编辑系统通知模板
        editNoticeTemHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var id = $target.data('id');
            var name = $target.data('name');
            var type = $target.data('type');
            var $dialog = Global.ui.dialog.show(
                {
                    title: '编辑模板',
                    body: '<div class="js-pt-edit-tem"></div>',
                    footer: '<button class="js-pt-editTem-confirm btn btn-primary" type="commit">确定</button><button class="btn" data-dismiss="modal">取消</button>'
                }
            );

            var $selectContainer = $dialog.find('.js-pt-edit-tem');
            var editTempleteView = new EditTempleteView({temId: id, name: name,type: type});
            $selectContainer.html(editTempleteView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                editTempleteView.destroy();
            });

            $dialog.off('click.editTemplete')
                .on('click.editTemplete', '.js-pt-editTem-confirm', function (ev) {
                  var $target2 = $(ev.currentTarget);
                  $target2.button('loading');
                  var $currContainer = $('.js-pt-edit-tem-form');
                  var clpValidate = $currContainer.parsley().validate();
                  if (clpValidate) {

                      return Global.sync.ajax({
                          url: '/intra/systemnotice/savenoticetem.json',
                          data: {
                              temId: id,
                              type: type,
                              content: $dialog.find('.js-pt-edit-content').val()
                          }
                      })
                        .always(function () {
                            $target2.button('res' +
                                'et');
                        })
                        .fail(function () {
                            // 处理失败
                        })
                        .done(function (res) {
                            if (res && res.result === 0) {
                                Global.ui.notification.show('操作成功。');
                                $dialog.modal('hide');
                                Global.appRouter.navigate(_('#mc/pt').addHrefArgs({_t: _.now()}), {
                                    trigger: true,
                                    replace: false
                                });
                            } else {
                                Global.ui.notification.show('操作失败。');
                            }
                        });
                  }else{
                      $target.button('reset');
                  }
                });

        },
        //启用，禁用通知配置
        editNoticeStatusHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var confId = $target.data('id');
            var type = $target.data("type");
            if (confId) {
                Global.sync.ajax({
                    url: '/intra/systemnotice/savenoticeconf.json',
                    data: {
                        confId: confId,
                        type: type,
                        sendType: _($target.parent().parent().find('.js-pt-type:checked')).map(function (type) {
                            return $(type).val();
                        })
                    },
                    tradition: true
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
                            Global.appRouter.navigate(_('#mc/pt').addHrefArgs({_t: _.now()}), {
                                trigger: true,
                                replace: false

                            });
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }
        }
    });

    module.exports = NoticeSettingView;
});