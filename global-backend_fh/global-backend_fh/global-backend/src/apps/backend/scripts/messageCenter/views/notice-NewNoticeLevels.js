define(function (require, exports, module) {

    var NewNoticeLevelsView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/notice-NewNoticeLevels.html'),
        rebate_template: require('text!com/rebateRight/rebate-Right-Config-css.html'),

        events: {
            'click .js-sp-level-btn-submit': 'newNoticeLevelHandler',
            'click .js-sp-level-btn-cancel': 'cancelBtnHandler',
            'click .js-pf-allUser': 'selectAllUserHandler',
            'click .js-pf-userLevel': 'checkAllUserSelectHandler'
        },


        onRender: function () {
            var self = this;
            this.$('.js-sp-notice-levels-form').prepend(_(this.rebate_template).template()());
            //初始化时间选择
            self.$('.js-sp-time').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD H:mm:ss',
                minDate: moment().add('days',-1)
            });

            self.$('#textarea1').richEditor();
        },
        newNoticeLevelHandler: function (e) {
            var self = this;
            var type = 1;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $currContainer = $('.js-sp-notice-levels-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                Global.sync.ajax({
                    url: '/intra/sendnotice/savenotice.json',
                    data: {
                        content: this.$('.js-sp-level-content').val(),
                        targetType: type,
                        sendTime: this.$('.js-sp-time').val(),
                        title: this.$('.js-sp-title').val(),
                        groupId: _(this.$('.js-pf-userLevel:checked')).map(function (type) {
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
        },
        selectAllUserHandler: function(){
            var $target = this.$('.js-pf-allUser');
            var checked = $target.prop('checked');
            if(checked){
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop('checked',true);
                });
            }else{
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop('checked',false);
                });
            }
        },
        checkAllUserSelectHandler: function(){
            var flag = true;
            var $target = this.$('.js-pf-userLevel');
            this.$('.js-pf-userLevel').each(function () {
                var checked = $(this).prop('checked');
                if(!checked){
                    flag = false;
                }
            });
            this.$('.js-pf-allUser').prop('checked',flag);
        }
    });

    module.exports = NewNoticeLevelsView;
});