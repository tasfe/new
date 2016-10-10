"use strict";

var WithdrawFinishView = Base.ItemView.extend({

    template: require('fundCenter/templates/withdraw-finished.html'),

    events: {

        // 'click .js-fc-wd-check': 'finishedHandler',
        // 'click .js-fc-wd-bet': 'goBetHandler'
    },


    className: '',

    onRender: function() {
        

    },

});

module.exports = WithdrawFinishView;