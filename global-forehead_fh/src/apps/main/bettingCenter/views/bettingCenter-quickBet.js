"use strict";


var QuickBetView = Base.ItemView.extend({


  events: {},



  onRender: function() {

    var self = this;
    var str = 	'<div class="js-bc-quick-btn nc-board-item clearfix router" data-affiche="111">11111111</div></br>'+
      '<div class="js-bc-quick-btn nc-board-item clearfix router" data-affiche="222">22222222</div></br>'+
      '<div class="js-bc-quick-btn nc-board-item clearfix router" data-affiche="3333">222222</div>'+

      '<div class="js-bc-quick-btn text-left" > 单击 </div>'+

      '</div>';


     //str = str+'<div class="js-bc-quick-btn text-left" >，请单击 </div>';
     $('.js-fc-quick-container').html(str);
  },




});

module.exports = QuickBetView;
