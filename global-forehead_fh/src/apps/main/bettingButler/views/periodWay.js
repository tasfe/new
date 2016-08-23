"use strict";



var PeriodWayView = Base.ItemView.extend({

    template: require('bettingButler/templates/periodWay.html'),

    events: {
    },

    initialize: function () {
      alert(template)
    },


    onRender: function() {
        alert(1111)
    }
});

module.exports = PeriodWayView;
