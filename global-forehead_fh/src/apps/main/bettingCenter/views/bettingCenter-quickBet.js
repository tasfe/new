"use strict";


var QuickBetView = Base.ItemView.extend({


  events: {},



  onRender: function() {

    var self = this;
    var str = 	'<div class="js-bc-quick-btn control-inlin-num" data-affiche="100">100元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="200">200元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="300">300元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="400">400元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="500">500元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="600">600元</div></br>'+

                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="800">800元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="1000">1000元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="1500">1500元</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="2000">2000</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="3000">3000</div>'+
                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="5000">5000</div></br>'+

                '<div class="js-bc-quick-btn control-inlin-num" data-affiche="">自定义</div></br>'+

      '<div class="js-bc-quick-btn text-left" > 确认投注 </div>'+

      '</div>';


     //str = str+'<div class="js-bc-quick-btn text-left" >，请单击 </div>';
     $('.js-fc-quick-container').html(str);
  },




});

module.exports = QuickBetView;
