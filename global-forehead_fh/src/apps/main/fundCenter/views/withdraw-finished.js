"use strict";

var WithdrawFinishView = Base.ItemView.extend({

    template: require('fundCenter/templates/withdraw-finished.html'),

    events: {

        'click .js-fc-wd-finished': 'finishedHandler'
    },


    className: '',

    onRender: function() {
        
        
    },

    finishedHandler:function () {
        window.open('#uc/wr');
    }

});

module.exports = WithdrawFinishView;