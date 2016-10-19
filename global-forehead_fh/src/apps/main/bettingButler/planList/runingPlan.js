"use strict";


var TabView = require('com/tabView');
var RuningPlanView = TabView.extend({
    template: require('bettingButler/templates/runningPlan.html'),
    events: {
        'click .js-new-plan-content': 'addPlan'
    },
    addPlan:function(){
        $('.js-new-plan-content').click(function(){
            $('.js-reward-grid').append('<tr><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td class="js-delete-tr">'+'删除'+'</td></tr>');
        });
        $('.js-delete-tr').click(function(){
            $(this).parent().remove();
        });
    },
    initialize: function () {

    },
    onRender: function() {

    }

   
    
});

module.exports = RuningPlanView;
