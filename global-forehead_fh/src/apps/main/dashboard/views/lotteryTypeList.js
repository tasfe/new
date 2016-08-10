"use strict";


var LotteryTypeListView = Base.ItemView.extend({

  //template: require('bettingCenter/templates/bettingCenter.html'),

  startOnLoading: true,

  events: {

  },



  onRender: function() {

    var tabs = ['时时彩','繁华彩','11选5','低频彩','快乐彩'];
    var html = [];
    _(tabs).each(function (element,index) {
      if (index===0){
        html.push('<li class="js-list-active1 list-active" data-index="'+index+'">'+element+'</li>');
      }else{
        html.push('<li class="js-list-active1" data-index="'+index+'">'+element+'</li>');
      }
    });

    var str1 = '<div class="main-active-container1">'+
      ' <div class="js-active-header active-container-header">'+
      '<ul class="js-activeHeader-list">';

    var str2 =' </ul>'+
      ' </div>'+
      ' <div class="js-active-context active-context"></div>'+
      '  </div>';

    $('.js-fc-quick-lottery').html(str1 + html.join('') + str2);


    var lotteryList = "";
    lotteryList += '<div class="js-lotteryList-0">';
    lotteryList += '<a href="#bc/1"><div class="js-list-close1 sfa-d-ssc-cq ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/3"><div class="js-list-close1 sfa-d-ssc-xj  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/8"><div class="js-list-close1  sfa-d-ssc-tj ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/9"><div class="js-list-close1 sfa-d-ssc-hlj  ssc-style-select"></div></a>';
    lotteryList += '<a href="#"><div class="js-list-close1 sfa-d-korea-15  ssc-style-select"></div></a>';
    lotteryList += '</div>';
    lotteryList += '<div class="js-lotteryList-1 hidden">';
    lotteryList += '<a href="#bc/10"><div class="js-list-close1 sfa-d-sp-ssc-ffc  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/13"><div class="js-list-close1 sfa-d-sp-ssc-sfc  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/12"><div class="js-list-close1 sfa-d-sp-ssc-wfc  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/16"><div class="js-list-close1 sfa-d-sp-3d-ffc  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/14"><div class="js-list-close1 sfa-d-sp-num-ffc ssc-style-select"></div></a>';
    lotteryList += '</div>';
    lotteryList += '<div class="js-lotteryList-2 hidden">';
    lotteryList += '<a href="#bc/5"><div class="js-list-close1 sfa-d-num-sd  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/4"><div class="js-list-close1 sfa-d-num-gd  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/11"><div class="js-list-close1 sfa-d-num-jx  ssc-style-select"></div></a>';
    lotteryList += '</div>';
    lotteryList += '<div class="js-lotteryList-3 hidden">';
    lotteryList += '<a href="#bc/6"><div class="js-list-close1 sfa-d-low-3d  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/7"><div class="js-list-close1 sfa-d-low-p5p3  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/19"><div class="js-list-close1 sfa-d-ne-ssc-smmc  ssc-style-select"></div></a>';
    lotteryList += '<a href="#bc/20"><div class="js-list-close1 sfa-d-sp-num-ffc  ssc-style-select"></div></a>';
    lotteryList += '</div>';
    lotteryList += '<div class="js-lotteryList-4 hidden">';
    lotteryList += '<a href="#bc/18"><div class="js-list-close1 sfa-d-bj-px10 ssc-style-select"></div></a>';
    lotteryList += '</div>';
    $('.js-active-context').html(lotteryList);

  }



});

module.exports = LotteryTypeListView;
