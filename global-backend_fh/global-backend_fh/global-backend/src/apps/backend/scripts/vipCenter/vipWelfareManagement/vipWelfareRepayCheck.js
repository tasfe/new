define(function (require, exports, module) {

    var CheckRepayView = Base.ItemView.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareRepayCheck.html'),

        events: {},

        vipWelFareRepayCheckXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/creditmng/repaymentdetail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            self.vipWelFareRepayCheckXhr({tradeNo: self.options.tradeNo}).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-ry-tradeNo').html(res.root.tradeNo);
                    self.$('.js-ry-username').html(res.root.username);
                    self.$('.js-ry-amount').html(_(res.root.amount).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ry-limit').html(_(res.root.betLimit).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ry-end-limit').html(_(res.root.betTotal).formatDiv(10000, {fixed: 0})+'（从借款到现在）');
                    var data=(res.root.betLimit-res.root.betTotal)/res.root.betLimit;
                    self.$('.js-ry-lave-limit').html(_(res.root.betLimit-res.root.betTotal).formatDiv(10000, {fixed: 0})+'（占还款流水要求的'+data*100+'%）');
                    self.$('.js-ry-end-profit').html(_(res.root.profit).formatDiv(10000, {fixed: 0})+'（从借款到现在）');
                    self.$('.js-ry-remark').html(res.root.remark);
                    self.$('.js-ry-remitBet').val(_(res.root.remitBet).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ry-takeBalance').val(_(res.root.takeBalance).formatDiv(10000, {fixed: 0}));
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            })

        }
    });

    module.exports = CheckRepayView;
});