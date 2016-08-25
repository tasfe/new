"use strict";

require('./style.scss');

var NewHelpCenterView = Base.ItemView.extend({

    template: require('newHelpCenter/index/index.html'),

    events: {
        'click .js-btn-hc': 'hcHandler'
    },

    hcHandler:function(e){
        var $target = $(e.currentTarget);
        var index = $target.data('index');
        //var i = $(".menu li").index(index);
        this.$(".menu li a").removeClass("act");
        this.$(".js-btn-hc-"+index).addClass("act");
        //this.$(this).children().addClass("act");
        this.$(".help-question-wr").hide();
        this.$(".js-hc-content-"+index).show();
    }

});


module.exports = NewHelpCenterView;

