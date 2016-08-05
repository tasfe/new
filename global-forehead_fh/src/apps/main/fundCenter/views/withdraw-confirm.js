"use strict";

var WithdrawFinishView = require('fundCenter/views/withdraw-finished');

var WithdrawConfirmView = Base.ItemView.extend({
    
    template: require('fundCenter/templates/withdraw-confirm.html'),

    events: {
        'click .js-fc-quickAmount': 'quickAmountHandler',
        'change .js-fc-wd-bankList': 'bankSelectedHandler',
        'click .js-ac-statistic-type': 'quickAmountHandler',
        'click .js-fc-wd-commit': 'nextStepHandler'
    },


    className: '',
    
    onRender: function() {

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

        var data = {
            cardId: this.options.cardId,
            amount: this.options.amount,
            payPwd: this.$('.js-fc-wd-payPwd').val(),
            answer: this.$('.js-fc-wd-amount').val(),
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
                $('.js-fc-wd-container').html(wfView.render().el);

            } else {
                Global.ui.notification.show(res.msg);
            }

         });

    }
    

});

module.exports = WithdrawConfirmView;