"use strict";


require('./index.scss');
var ActivityEntry = Base.PrefabView.extend({

    template: require('./index.html'),

    event:{
      'click .activity-entry-a':'closeHandler'
    },

    initialize: function() {
    },

    //common APIs

    render: function() {
        var self = this;

        this._checkVisible();


        return this;
    },


});

module.exports = ActivityEntry;
