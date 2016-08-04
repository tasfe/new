define(function (require, exports, module) {

    var EditTempleteiew = Base.ItemView.extend({

        template: require('text!messageCenter/templates/notice-EditTemplete.html'),

        events: {},

        getNoticeTempleteXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/systemnotice/getnoticetem.json',
                data:data
            });
        },

        onRender: function() {
            var self = this;

            self.getNoticeTempleteXhr({temId:self.options.temId,type:self.options.type}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-pt-tem-name').html('<label class="control-label">'+self.options.name+'</label>');
                    self.$('.js-pt-edit-content').val(res.root.temeContent);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
        }
    });

    module.exports = EditTempleteiew;
});