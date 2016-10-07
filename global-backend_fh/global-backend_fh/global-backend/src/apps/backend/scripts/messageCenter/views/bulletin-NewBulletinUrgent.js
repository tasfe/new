define(function (require, exports, module) {

    var NewNoticeUrgentView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/bulletin-NewBulletinUrgent.html'),
        rebate_template: require('text!com/rebateRight/rebate-Right-Config.html'),

        events: {
            'click .js-cn-urgent-btn-submit': 'newBulletinUrgentHandler',
            'click .js-cn-btn-cancel': 'formCancelHandler',
            'click .js-pf-allUser': 'selectAllUserHandler',
            'click .js-pf-userLevel': 'checkAllUserSelectHandler'
        },


        onRender: function () {
            var self = this;
            this.$('.js-cn-notice-urgent-form').prepend(_(this.rebate_template).template()());
            //初始化时间选择
            self.$('.js-cn-urgent-starttime').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD H:mm:ss'
            });
            self.$('.js-cn-urgent-endTime').datetimepicker({
                useCurrent: false,
                format: 'YYYY-MM-DD H:mm:ss'
            });

            this.$('#textarea1').richEditor();
        },
        newBulletinUrgentHandler: function (e) {
            var self = this;
            var type = 1;
            var $target = $(e.currentTarget);
            $target.button('loading');
            var $time = this.$('.js-cn-general-starttime');
            if($time.val===''){

            }
            var $currContainer = this.$('.js-cn-notice-urgent-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                var userLevel = [];
                _(this.$('.js-pf-userLevel')).map(function(item){
                    if($(item).prop('checked')){
                        userLevel.push( $(item).val());
                    }
                });
                Global.sync.ajax({
                    url: '/intra/newbullet/savebulletin.json',
                    data: {
                        content: this.$('.js-cn-urgent-content').val(),
                        isUrgent: type,
                        onlineTime: _(this.$('.js-cn-urgent-starttime').val()).toTime(),
                        offlineTime: _(this.$('.js-cn-urgent-endTime').val()).toTime(),
                        title: this.$('.js-cn-urgent-title').val(),
                        userLevel: userLevel.join(','),
                        broadcast:this.$('.js-cn-broadcast:checked').val()
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
                            Global.appRouter.navigate(_('#mc/cn').addHrefArgs({_t: _.now()}), {
                                trigger: true,
                                replace: false
                            });
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }
        },
        formCancelHandler: function (e) {
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

    module.exports = NewNoticeUrgentView;
});