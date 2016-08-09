define(function (require, exports, module) {

    var NewNoticeGroupsView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/notice-NewNoticeGroups.html'),

        events: {
            'click .js-sp-group-btn-submit': 'newNoticeGroupHandler',
            'click .js-sp-group-btn-cancel': 'cancelBtnHandler'
        },


        onRender: function () {
            var self = this;
            //初始化时间选择
            self.$('.js-sp-time').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD H:mm:ss',
                minDate: moment().add('days',-1)
            });

            self.$('#textarea1').richEditor();
        },
        newNoticeGroupHandler: function (e) {
            var self = this;
            var type = 1;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-sp-notice-groups-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                    url: '/intra/sendnotice/savenotice.json',
                    data: {
                        content: this.$('.js-sp-group-content').val(),
                        targetType: type,
                        sendTime: this.$('.js-sp-time').val(),
                        title: this.$('.js-sp-title').val(),
                        groupId: _(this.$('.js-sp-group:checked')).map(function (type) {
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
                            Global.appRouter.navigate(_('#mc/sp').addHrefArgs({_t: _.now()}), {
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
        },
        cancelBtnHandler: function(){
            this.render();
        }
    });

    module.exports = NewNoticeGroupsView;
});