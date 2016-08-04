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
        
        
    },

    nextStepHandler:function () {
        var wfView = new WithdrawFinishView({parentView: this.parentView});
        $('.js-fc-wd-container').html(wfView.render().el);
    }

});

module.exports = WithdrawConfirmView;