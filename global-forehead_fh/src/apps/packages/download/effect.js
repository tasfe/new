$(function () {
    var clear_page_01;
    var clear_page_02;
    var clear_page_03;

    $('.wm-loader-wrapper').addClass('hidden');
    $('.wm-loader-wrapper').addClass('hidden');
    $('.js-package .page').css('height',$(document).height());
    $('.bg1').css('height',$(document).height());
    $('.bg2').css('height',$(document).height());
    $('.bg3').css('height',$(document).height());
    $('.page1').css('opacity',0).removeClass('hidden');
    $('.page1').animate({opacity:1}, 800,function () {
        clear_page_01 = setInterval(effectPage01, 50);
    });

    $('.js-download').removeAttr('style');

    $('.menu span').on('click',function () {
    	$('.menu span').removeClass('sd');
    	$(this).addClass('sd');
        clearInterval(clear_page_01);
        clearInterval(clear_page_02);
        clearInterval(clear_page_03);

    	$('.page').addClass('hidden');
    	if ($(this).data('id') == 1) {
    		$('.page1').css('opacity',0).removeClass('hidden');
            $('.page1').animate({opacity:1}, 800, function(){
                clear_page_01 = setInterval(effectPage01, 50);
            });
    	}
    	else if ($(this).data('id') == 2){
    		$('.page2').css('opacity',0).removeClass('hidden');
            $('.page2').animate({opacity:1}, 800, function(){
                clear_page_02 = setInterval(effectPage02, 50);
            });
    	}
    	else if ($(this).data('id') == 3){
    		$('.page3').css('opacity',0).removeClass('hidden');
            $('.page3').animate({opacity:1}, 800,function(){
                clear_page_03 = setInterval(effectPage03, 50);
            });
    	}
    })

    //页面1效果
    var $pc_bg = $(".bg1");
    var pc_speed = 1;
    var pc_num = 0.001;

    function effectPage01() {
        if (parseInt(pc_speed * 10) > 12) {
            pc_num *= -1;
        }
        if (parseInt(pc_speed * 10) < 10) {
            pc_num *= -1;
        }
        pc_speed += pc_num;
        $pc_bg.css("transform", "scale(" + pc_speed + ")");
    }

    //页面2效果
    var $pc_bg2 = $(".bg2");
    var pc_speed2 = 1;
    var pc_num2 = 0.001;

    function effectPage02() {
        if (parseInt(pc_speed2 * 10) > 12) {
            pc_num2 *= -1;
        }
        if (parseInt(pc_speed2 * 10) < 10) {
            pc_num2 *= -1;
        }
        pc_speed2 += pc_num2;
        $pc_bg2.css("transform", "scale(" + pc_speed2 + ")");
    }

    //页面3效果
    var $pc_bg3 = $(".bg3");
    var pc_speed3 = 1;
    var pc_num3 = 0.001;

    function effectPage03() {
        if (parseInt(pc_speed3 * 10) > 12) {
            pc_num3 *= -1;
        }
        if (parseInt(pc_speed3 * 10) < 10) {
            pc_num3 *= -1;
        }
        pc_speed3 += pc_num3;
        $pc_bg3.css("transform", "scale(" + pc_speed3 + ")");
    }
});

$( window ).resize(function() {
    $('.bg1').css('height',$(document).height());
    $('.bg2').css('height',$(document).height());
    $('.bg3').css('height',$(document).height());
});