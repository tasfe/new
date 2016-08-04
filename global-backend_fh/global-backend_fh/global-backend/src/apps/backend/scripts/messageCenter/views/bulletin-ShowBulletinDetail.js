define(function (require, exports, module) {

    var ShowBulletinDetailView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/bulletin-ShowBulletinDetail.html'),

        events: {},

        getBulletinDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/bulletinmanage/getbulletindetail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            self.getBulletinDetailXhr({bulletinId: self.options.bulletinId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    if (res.root.isUrgent == 0) {
                        self.$('.js-nm-type').html('<span class="js-nm-type-val help-inline" value="0">普通</span>');
                    }
                    if (res.root.isUrgent == 1) {
                        self.$('.js-nm-type').html('<span class="js-nm-type-val help-inline" value="0">紧急</span>');
                    }
                    self.$('.js-nm-title').html(res.root.title);
                    self.$('.js-nm-creater').html(res.root.createrName);
                    self.$('.js-nm-startime').html(_(res.root.onlineTime).toTime());
                    if(res.root.isUrgent == 1){
                        self.$('.js-nm-showendtime').html('<label class="col-sm-2 control-label">过期时间：</label><div class="col-sm-10"><div class="has-success">' +
                            '<label class="js-nm-endtime control-label"></label></div></div>');
                        self.$('.js-nm-endtime').html(_(res.root.offlineTime).toTime());
                    }
                    self.$('.js-nm-show-content').val(res.root.content)
                } else {
                    Global.ui.notification.show('数据异常。');
                }

                self.$('#textarea1').richEditor();
            });
        }
    });

    module.exports = ShowBulletinDetailView;
});