define(function (require, exports, module) {
    var RebateRightView = require('com/rebateRight/index');

    var EditBulletinView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/bulletin-EditBulletin.html'),

        events: {
            'click .js-cn-btn-submit': 'newBulletinHandler'
        },

        getActivityDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/bulletinmanage/getbulletindetail.json',
                data:data
            });
        },

        onRender: function() {
            var self = this;

            self.getActivityDetailXhr({bulletinId:self.options.bulletinId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var option = {userLevel:res.root.userLevel,disabled:1};
                    var rebateRightView = new RebateRightView(option);
                    self.$('.js-nm-edit-form').prepend(rebateRightView.render().$el);
                    if (res.root.isUrgent == 0) {
                        self.$('.js-nm-edit-type').html('<label name="type" class="js-nm-type control-label" data-type="0">普通</label>');
                    }
                    if (res.root.isUrgent == 1) {
                        self.$('.js-nm-edit-type').html('<label name="type" class="js-nm-type control-label" data-type="1">紧急</label>');
                    }
                    self.$('.js-nm-edit-title').val(res.root.title);
                    self.$('.js-nm-edit-starttime').val(_(res.root.onlineTime).toTime());
                    if(res.root.isUrgent == 1){
                        self.$('.js-nm-edit-endtime').html('<label class="col-sm-3 control-label">过期时间：</label><div class="col-sm-9">' +
                            '<input type="text" class="js-nm-endtime input-medium form-control" name="endTime" required></div>');
                        self.$('.js-nm-endtime').val(_(res.root.offlineTime).toTime());
                    }
                    self.$('.js-nm-edit-content').val(res.root.content);
                    self.$('.js-nm-edit-desc').val(res.root.desc);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
                //初始化时间选择
                self.$('.js-nm-edit-starttime').datetimepicker({
                    useCurrent: false,
                    format: 'YYYY-MM-DD H:mm:ss'
                });
                self.$('.js-nm-endtime').datetimepicker({
                    useCurrent: false,
                    format: 'YYYY-MM-DD H:mm:ss'
                });

                self.$('#textarea1').richEditor();
            });
        }
    });

    module.exports = EditBulletinView;
});