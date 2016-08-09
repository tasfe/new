define(function (require, exports, module) {

    var CheckReqView = Base.ItemView.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareReqCheck.html'),

        events: {
            'click .js-ap-result':'changeStatus'
        },

        vipWelFareRepayCheckXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/creditmng/detail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            self.vipWelFareRepayCheckXhr({tradeNo: self.options.tradeNo}).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-ap-username').html(res.root.username);
                    self.$('.js-ap-level').html('V'+res.root.userLevel);
                    self.$('.js-ap-amount').html(_(res.root.reqAmount).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ap-req-time').html(_(res.root.reqDate).toTime());
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            })

        },
        changeStatus:function(e){
            var self = this;
            var $target = self.$(e.currentTarget);
            if($target.val() == "2"){
                self.$('.js-ap-des').attr("disabled",false);
                self.$('.js-ap-req-amount').attr("disabled",true);
            }else if($target.val() == "1"){
                self.$('.js-ap-des').attr("disabled",true);
                self.$('.js-ap-req-amount').attr("disabled",false);
            }
        }
    });

    module.exports = CheckReqView;
});