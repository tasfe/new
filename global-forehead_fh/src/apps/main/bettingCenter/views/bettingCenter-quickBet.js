"use strict";


var QuickBetView = Base.ItemView.extend({


  events: {},



  onRender: function() {

    var self = this;
    var str = 	'<div class="control-quick-div">'+
                '<div class="js-bc-quick-btn control-inlin-quick " data-affiche="100">100元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="200">200元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="300">300元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="400">400元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="500">500元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="600">600元</div></br>'+

                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="800">800元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="1000">1000元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="1500">1500元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="2000">2000元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="3000">3000元</div>'+
                '<div class="js-bc-quick-btn control-inlin-quick" data-affiche="5000">5000元</div>' +
                '</br>'+

                '<div class="js-bet-div0-02 control-inlin-quick"   >自定义</div> ' +
                '</br>'+
                '<div class="js-bet-div0-01" style="display: none"> ' +
                '<input type="text" class="js-bc-quick-value control-text-quick"/>'+
                //'<div class="js-bc-quick-text-bet quick-text-bet  text-center"> 确认 </div>'+
                //'<div class="js-bc-quick-text-cancel  quick-text-cancel text-center "> 取消 </div>'+
                '</div>' +
                '</br></br></br>'+

                '<div class="js-bc-quick-btn-bet quick-btn-bet  text-center "> 确认投注 </div>'+
                '<div class="js-bc-quick-btn-cancel  quick-btn-cancel text-center close"   data-dismiss="modal"> 取消 </div>'+
                '</div>';


     //str = str+'<div class="js-bc-quick-btn text-left" >，请单击 </div>';
     $('.js-fc-quick-container').html(str);
  },




});

module.exports = QuickBetView;
