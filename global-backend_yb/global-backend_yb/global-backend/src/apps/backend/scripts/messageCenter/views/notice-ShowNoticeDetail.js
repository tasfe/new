define(function (require, exports, module) {

    var ShowNoticeDetailView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/Notice-ShowNoticeDetail.html'),

        events: {},

        getNoticeDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/systemnotice/getnoticedetail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            self.getNoticeDetailXhr({noticeId: self.options.noticeId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-pm-name').html(res.root.users);
                    self.$('.js-pm-title').html(res.root.title);
                    self.$('.js-pm-creater').html(res.root.sendName);
                    self.$('.js-pm-startime').html(_(res.root.sendTime).toTime());
                    self.$('.js-pm-show-content').html(res.root.context)
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
        }
    });

    module.exports = ShowNoticeDetailView;
});