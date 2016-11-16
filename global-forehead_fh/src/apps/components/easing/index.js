"use strict";

require('main/bettingCenter/mmc/easing');

var BettingInfoModel = require('bettingCenter/models/bettingInfo');

var Easing = Base.PrefabView.extend({

    template:require('./index.html'),

    options: {
        duration: 500,
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        destroyOnStop: true,
        delayTip: '延时开奖',
        emptyTip: '官方未开奖'
    },

    initialize: function () {
        this.infoModel = new BettingInfoModel();
        
        this.listenTo(this.infoModel, 'change:sale', this.renderSale);
    },

    onRender: function () {
        this.startAnimate();
    },

    startAnimate:function () {

    },

    stopAnimation:function () {

    },

    destroyAnimation:function () {
        
    }

});

module.exports = Easing;