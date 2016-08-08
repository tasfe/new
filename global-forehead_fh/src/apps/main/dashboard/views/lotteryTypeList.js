"use strict";


var LotteryTypeListView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  events: {


  },



  onRender: function() {

    var self = this;

    var lotteryList = "";
    lotteryList += '<a href="#bc/1" target="_parent" " ><div class=" sfa-d-ssc-cq " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/3"><div class=" sfa-d-ssc-xj " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/8"><div class="  sfa-d-ssc-tj" style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/9"><div class=" sfa-d-ssc-hlj " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#"><div class=" sfa-d-korea-15 " style="width: 100px; height: 100px; float: left"></div></a>';

    lotteryList += '<a href="#bc/10"><div class=" sfa-d-sp-ssc-ffc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/13"><div class=" sfa-d-sp-ssc-sfc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/12"><div class=" sfa-d-sp-ssc-wfc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/16"><div class=" sfa-d-sp-3d-ffc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/14"><div class="sfa-d-sp-num-ffc" style="width: 100px; height: 100px; float: left"></div></a>';

    lotteryList += '<a href="#bc/5"><div class=" sfa-d-num-sd " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/4"><div class=" sfa-d-num-gd " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/11"><div class=" sfa-d-num-jx " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/6"><div class=" sfa-d-low-3d  " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/7"><div class=" sfa-d-low-p5p3 " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/19"><div class=" sfa-d-ne-ssc-smmc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/20"><div class=" sfa-d-sp-num-ffc " style="width: 100px; height: 100px; float: left"></div></a>';
    lotteryList += '<a href="#bc/18"><div class=" sfa-d-bj-px10 " style="width: 100px; height: 100px; float: left"></div></a>';


    this.$dialogRe.find('.js-fc-quick-lottery').html(lotteryList);

  }




});

module.exports = LotteryTypeListView;
