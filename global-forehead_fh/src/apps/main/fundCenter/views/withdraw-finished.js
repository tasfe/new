"use strict";

var WithdrawFinishView = Base.ItemView.extend({

    template: require('fundCenter/templates/withdraw-finished.html'),

    events: {

        'click .js-fc-wd-commit': 'finishedHandler'
    },


    className: '',

    onRender: function() {


    },

    finishedHandler:function () {
        
    }

});

module.exports = WithdrawFinishView;