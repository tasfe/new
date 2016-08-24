"use strict";

require('./style.scss');

var NewHelpCenterView = Base.ItemView.extend({

    template: require('newHelpCenter/index/index.html'),

    events: {
        'click .menu li':'',
    },
});


module.exports = NewHelpCenterView;

