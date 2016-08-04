define(function (require, exports, module) {

    var NewNoticeUsersView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/notice-NewNoticeUsers.html'),

        events: {
            'click .js-sp-user-btn-submit': 'newBulletinUrgentHandler',
            'click .js-sp-user-btn-cancel': 'cancelBtnHandler'
        },


        onRender: function () {
            var self = this;
            //文本导入
            this.$('.js-mc-nnu-Upload-btn').fileLoad({
                title: '批量导入用户名',
                done: function (res) {
                    //显示图片
                    self.$('.js-sp-username-content').val(res.root);
                },
                fail: function(){
                    Global.ui.notification.show('操作失败。');
                }
            });
            //初始化时间选择
            self.$('.js-sp-time').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD H:mm:ss',
                minDate: moment().add('days',-1)
            });

            self.$('#textarea1').richEditor();
        },
        //上传附件
        generateImageArea: function (url, name) {
            this.$('.js-sp-user-attach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
                '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
                url + '" class="js-sp-userfile-attach square-sm">' + (name ? '<div class="gallery-title">' + name + '</div>' : '') + '</div></div>'));
        },
        newBulletinUrgentHandler: function (e) {
            var self = this;
            var type = 2;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-sp-notice-users-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                    url: '/intra/sendnotice/savenotice.json',
                    data: {
                        content: this.$('.js-sp-users-content').val(),
                        targetType: type,
                        sendTime: this.$('.js-sp-time').val(),
                        title: this.$('.js-sp-title').val(),
                        username:this.$('.js-sp-username-content').val()
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

    module.exports = NewNoticeUsersView;
});