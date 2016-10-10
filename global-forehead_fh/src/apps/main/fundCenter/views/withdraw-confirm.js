"use strict";

var bankConfig = require('userCenter/misc/bankConfig');
var WithdrawFinishView = require('fundCenter/views/withdraw-finished');

var WithdrawConfirmView = Base.ItemView.extend({
    
    template: require('fundCenter/templates/withdraw-confirm.html'),

    events: {
        'click .js-fc-quickAmount': 'quickAmountHandler',
        'change .js-fc-wd-bankList': 'bankSelectedHandler',
        'click .js-ac-statistic-type': 'quickAmountHandler',
        'click .js-fc-wd-commit': 'nextStepHandler',
        'click .js-fc-wd-return': 'prevPageHandler'
    },


    className: '',
    
    onRender: function() {

        var bankInfo = bankConfig.get(this.options.bankId);
        this.$('.js-fc-wd-confirm-bank').attr('src',bankInfo.logo);
        this.$('.js-fc-wd-confirm-customerName').html(this.options.cusName);
        this.$('.js-fc-wd-confirm-cardNo').html(this.options.cardNo);
        this.$('.js-fc-wd-confirm-amount').html(Number(this.options.amount).toFixed(2));
        this.$('.js-fc-question').html(this.options.question);
        
    },

    getWithdrawXhr: function(data) {
        return Global.sync.ajax({
            url: '/fund/withdraw/withdraw.json',
            data: _(data).extend({
                device: 0
            })
        });
    },

    nextStepHandler:function () {

        var $btnConfirm = this.$('.js-fc-wd-commit');
        $btnConfirm.button('loading');
        this.$form = this.$('.js-fc-wd-confirm-form');
        this.parsley = this.$form.parsley();
        if (!this.parsley.validate()) {
            $btnConfirm.button('reset');
            return false;
        }

        var data = {
            cardId: this.options.cardId,
            amount: this.options.amount,
            payPwd: this.$('.js-fc-wd-paypwd').val(),
            answer: this.$('.js-fc-wd-answer').val(),
            securityId: this.options.securityId,
            type: 'withdraw'
        };

         this.getWithdrawXhr(data)
         .always(function() {
            $btnConfirm.button('reset');
         })
         .done(function(res) {
            if (res && res.result === 0) {
                var wfView = new WithdrawFinishView({parentView: this.parentView});
                $('.js-fc-wd-container-sub').html(wfView.render().el);
            } else {
                var wfView = new WithdrawFinishView({parentView: this.parentView});
                $('.js-fc-wd-container-sub').html(wfView.render().el);
                Global.ui.notification.show(res.msg);
            }

         });
    },
    prevPageHandler: function(){
        $('.js-fc-wd-container-sub').addClass('hidden');
        $('.js-fc-wd-form').removeClass('hidden');
    }

});

module.exports = WithdrawConfirmView;