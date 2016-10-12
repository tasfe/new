define(function (require, exports, module) {

    var RechargeTimeSetView = Base.ItemView.extend({

        template: require('text!./rechargeTimeSet.html'),

        events: {
            //'click .js-ul-editRebate-confirm':'updateUserRebateHandle'
        },

        getSetXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/rechargemanage/timeconf.json',
                data:data
            });
        },

        onRender: function() {
            var self = this;
            self.getSetXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    if(res.root&&_(res.root).size()>0){
                        if (root.fullTimeService) {
                            self.$('input[type="radio"][name="fullTimeService"][value="true"]').prop('checked', true);
                        } else {
                            self.$('input[type="radio"][name="fullTimeService"][value="false"]').prop('checked', true);
                            this.$('.js-fc-rechargeSet-startTime').val(root.startTime);
                            this.$('.js-fc-rechargeSet-endTime').val(root.endTime);
                        }
                    }else{
                        //Global.ui.notification.show('用户未设置配额');
                        Global.ui.notification.show('数据异常。');
                    }
                }else {
                    Global.ui.notification.show('数据异常。');
                }


            });
        }
    });

    module.exports = RechargeTimeSetView;
});