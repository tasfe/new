"use strict";

require('./style.scss');

var NewHelpCenterView = Base.ItemView.extend({

    template: require('newHelpCenter/index/index.html'),

    events: {},
    onRender: function() {
        $(".menu li").click(function() {
            var i = $(".menu li").index($(this));
            alert(i)
            $(".menu li a").removeClass("act");
            $(this).children().addClass("act");
            $(".help-question-wr").hide().eq(i).show()
        })
    }

});


module.exports = NewHelpCenterView;

