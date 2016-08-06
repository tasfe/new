define(function (require, exports, module) {

    var CheckReqAgainView = Base.ItemView.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareReqAgainCheck.html'),

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
                    self.$('.js-ap-check-time').html(_(res.root.firstCheck.checkDate).toTime());
                    self.$('.js-ap-check-name').html(res.root.firstCheck.checker);
                    var sContent='';
                    if(res.root.firstCheck.status==1){
                        sContent='批准';
                    }else{
                        sContent='拒绝';
                    }
                    self.$('.js-ap-check-result').html(sContent);
                    self.$('.js-ap-check-amount').html(_(res.root.firstCheck.amount).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ap-check-remark').html(res.root.firstCheck.remark);
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

    module.exports = CheckReqAgainView;
});