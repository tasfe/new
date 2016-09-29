require('./index.scss');
require('./../../../base/flat/red.css');
require('./jquery-ui');
require('./../misc/common-init.js');

$.widget('gl.investment', {

	template: require('./index.html'),

	_create: function () {
		this.element.html(_(this.template).template()());

		this._bindEvent();
	},

	_bindEvent: function () {
	    var self = this;
	    //绑定事件
	    this._on({
	      'click .js-page5submit': 'infoSubmit'//设置成功
	    });
	},

	infoSubmit: function (e) {
		var self = this;
	    var $target = $(e.currentTarget);

	    if ($target.text() == 'loading') {
	    	return;
	    }

		var amount = $('.js-page5sales').val();
		var name = $('.js-page5name').val();
		var qq = $('.js-page5qq').val();
		var spread = '';
		if ($("input[name='iCheck']:checked").val() != undefined) {
			spread = $("input[name='iCheck']:checked").val();
		}

		var website =  $('.js-page5url1').val();
		if ($('.js-page5url1').val() != '' && $('.js-page5url2').val() != '') {
			website + ',';
		}
		website += $('.js-page5url2').val();

		if (name == '') {
			$('.js-tips').html('*昵称不能为空');
		}
		else if (amount == '') {
			$('.js-tips').text('*现有平台日量不能为空');
		}
		else if(qq == ''){
			$('.js-tips').text('*qq不能为空');
		}
		else{
			$('.js-page5sales').val('');
			$('.js-page5name').val('');
			$('.js-page5qq').val('');
			$('.js-page5url1').val('');
			$('.js-page5url2').val('');
			$target.text('loading');
			this.sendInfo(amount,name,qq,spread,website).fail(function () {
				Global.ui.notification.show('网络报错');
			})
			.always(function() {
				$target.text('提交');
		    })
			.done(function (res) {
		        if (res && res.result === 0) {
		          	Global.ui.notification.show('<h4>提交成功</h4><br>请您耐心等待，相关部门会尽快联系您，谢谢');
		        } else {
		        	Global.ui.notification.show('提交失败,' + res.msg);
	        	}
	    	});
		}
	},

	sendInfo: function (amount,name,qq,spread,website) {
	    return $.ajax({
	      type: 'POST',
	      url: '/info/joinus/join.json',
	      data: {
	      	amount: amount,
	      	name: name,
	      	qq: qq,
	      	spread: spread,
	      	website: website,
	      	email: ''
	      }
	    });
	}
});

var i = 0;
var pageNum = 0;
var bgWidth = 1920;
var bgHeight = 1000;
var realBgWidth = bgWidth / bgHeight * $(window).height();
var hideBgWidth = realBgWidth - $(window).width();
var page2onmouseover = 0;
var isPhone = 0;
var phoneActiveNum = 0;

function page1Logo(resize) {
	var width = 199;
	var heigh = 85;
	var top = 120;
	var left = 852;

	if (isPhone == 1) {
		top -= 70;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.logo').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		if (isPhone == 1) {
			$('.logo').css({'top':realTop-40,'left':realLeft,'height':realHeight,'opacity':0.5});
		}
		else{
			$('.logo').css({'top':realTop+40,'left':realLeft,'height':realHeight,'opacity':0});
		}
		$(".logo").animate({top:realTop,opacity:1},800);
	}
}

function page1AboutUs(resize) {
	if (isPhone == 0) {
		var width = 130;
		var heigh = 247;
		var top = 317;
		var left = 384;

		var realHeight = $(window).height() / bgHeight * heigh;
		var realTop = $(window).height() / bgHeight * top;
		var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
		
		if (resize) {
			$('.aboutUs').css({'top':realTop,'left':realLeft,'height':realHeight});
		}
		else{
			$('.aboutUs').css({'top':realTop,'left':realLeft-60,'height':realHeight,opacity:0.2});
			$(".aboutUs").animate({left:realLeft,opacity:1},800);
		}
	}
}

function page1Describe(resize) {
	var width = 907;
	var top = 317;
	var left = 552;

	if (isPhone == 1) {
		top -= 130;
	}

	var realWidth  =   $(window).height() / bgHeight * width;
	var realTop  =   $(window).height() / bgHeight * top;
	var realLeft  =   $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (isPhone == 1) {
		realWidth =  $(window).width() * 0.8;
		realLeft = $(window).width() * 0.1;
	}

	if (resize) {
		$('.describe').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		if (isPhone == 1) {
			$('.describe').css({'top':realTop + 40,'left':realLeft,'width':realWidth,opacity:0.2});
		}
		else{
			$('.describe').css({'top':realTop,'left':realLeft + 80,'width':realWidth,opacity:0.2});
		}
		$(".describe").animate({left:realLeft,top:realTop,opacity:1},800);
	}
}

function menu(resize) {
	var top = 284;
	var right = 54;
	var realTop  =   $(window).height() / bgHeight * top;
	var realRight  =   $(window).height() / bgHeight * right - hideBgWidth / 2;

	var bgColor = '#6f251d';
	var liTop = [0,0,91,182,273];
	var liShow = [1,2,3,4];

	if (pageNum == 1) {
		bgColor = '#d7afcb';
		liTop = [0,0,91,182,273];
		liShow = [0,2,3,4];
	}
	else if (pageNum == 2) {
		bgColor = '#3099b3';
		liTop = [0,91,0,182,273];
		liShow = [0,1,3,4];
	}
	else if (pageNum == 3) {
		bgColor = '#adb3b5';
		liTop = [0,91,182,0,273];
		liShow = [0,1,2,4];
	}
	else if (pageNum == 4) {
		bgColor = '#cc3333';
		liTop = [0,91,182,273,0];
		liShow = [0,1,2,3];
	}
	
	if (realRight <= 20) {
		realRight = 20;
	}
	$('.menu').css({'top':realTop,'right':realRight});
	$('.menu li').removeClass('hidden');
	$('.menu li').eq(pageNum).addClass('hidden');

	if (resize) {
		$('.menu li').eq(liShow[0]).css({'top':liTop[liShow[0]],'opacity':1});
		$('.menu li').eq(liShow[1]).css({'top':liTop[liShow[1]],'opacity':1});
		$('.menu li').eq(liShow[2]).css({'top':liTop[liShow[2]],'opacity':1});
		$('.menu li').eq(liShow[3]).css({'top':liTop[liShow[3]],'opacity':1});
	}
	else{
		$('.menu li').eq(liShow[0]).css({'top':liTop[liShow[0]] -100,'opacity':0});
		$('.menu li').eq(liShow[1]).css({'top':liTop[liShow[1]] -100,'opacity':0});
		$('.menu li').eq(liShow[2]).css({'top':liTop[liShow[2]] -100,'opacity':0});
		$('.menu li').eq(liShow[3]).css({'top':liTop[liShow[3]] -100,'opacity':0});

		$('.menu li').eq(liShow[3]).animate({top:273,opacity:1,backgroundColor:bgColor},300,function () {
			$('.menu li').eq(liShow[2]).animate({top:182,opacity:1,backgroundColor:bgColor},250,function () {
				$('.menu li').eq(liShow[1]).animate({top:91,opacity:1,backgroundColor:bgColor},200,function () {
					$('.menu li').eq(liShow[0]).animate({top:0,opacity:1,backgroundColor:bgColor},150,function () {
						$('.menu').animate({opacity:0.5},500,function () {
							$('.menu').animate({opacity:1},800,function () {
							
							});
						});
					});
				});
			});
		});
	}
}

function page2_title(resize) {
	var width = 322;
	var heigh = 107;
	var top = 134;
	var left = 800;

	if (isPhone == 1) {
		top -= 80;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	
	if (resize) {
		$('.2_title').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.2_title').css({'top':realTop,'left':realLeft -25,'width':realWidth + 50,'height':realHeight,'opacity':0.4});
		$(".2_title").animate({left:realLeft,width:realWidth,opacity:1},800);
	}
}

function page2_icon1(resize,phoneActive) {
	var width = 290;
	var heigh = 200;
	var top = 360;
	var top2 = 360;
	var left = 356;
	var left2 = 664;

	if (isPhone == 1) {
		left = 700;
		left2 = 640;
		top = 230;
		top2 = 230;
		width = 520;
		heigh = 140;

		if (phoneActive == 1) {

			$('.content1-2 h3').removeClass('hidden');
			top = 300;
		}
		else if (phoneActive == 2) {
			width = 90;
			top = 200;
			left = 700;
			heigh = 90;

			$('.content1-2 h3').addClass('hidden');
			$('.content1-2 hr').addClass('hidden');
			$('.content1-2 i').animate({opacity:1,height:50,marginTop:'10%'},500);
			$('.content1-2 > span').css('opacity',0);
			$('.content1-2 > span').addClass('hidden');
		}
		else{
			$('.content1-2 h3').removeClass('hidden').removeClass('h3center');
			$('.content1-2 hr').addClass('hidden');
			$('.content1-2 i').removeAttr('style');
			$('.content1-2 i').removeClass('hidden');
			$('.content1-2 > span').css('opacity',0);
			$('.content1-2 > span').addClass('hidden');
		}
	}
	else{
		$('.content1-2 h3').removeClass('hidden');
		$('.content1-2 > span').css('opacity',0);
		$('.content1-2 > span').addClass('hidden');
		$('.content1-2 i').removeClass('hidden')
		$('.content1-2 i').removeAttr('style')
		$('.content1-2 hr').addClass('hidden');
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;


	if (isPhone == 1) {
		if (resize) {
			$('.content1-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content1-2').css({'top':realTop2,'left':realLeft2,'height':realHeight,'width':realWidth,opacity:0});
			$('.content1-2').removeClass('hidden');
			$(".content1-2").animate({top:realTop,left:realLeft,opacity:1},600,function () {
				page2onmouseover = 1;
			});
		}
	}
	else{
		if (resize) {
			$('.content1-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content1-2').css({'top':realTop,'left':realLeft2,'height':realHeight,'width':realWidth,opacity:0.3});
			$('.content1-2').removeClass('hidden');
			
			$(".content1-2").animate({left:realLeft,opacity:1},500,function () {
				page2onmouseover = 1;
			});
		}
	}
}

function page2_icon2(resize,phoneActive) {
	var width = 290;
	var width2 = 290;
	var heigh = 200;
	var heigh2 = 200;
	var top = 360;
	var top2 = 580;
	var left = 664;
	var left2 = 664;
	

	if (isPhone == 1) {
		left = 700;
		left2 = 760;
		top = 410;
		width = 520;
		heigh = 140;
		heigh2 = 140;

		if (phoneActive == 1) {
			top = 300;

			$('.content2-2 h3').removeClass('hidden').addClass('h3center');
			$('.content2-2 i').addClass('hidden');
		}
		else if (phoneActive == 2) {
			width = 90;
			top = 200;
			if (phoneActiveNum == 1) {
				left = 700;
			}
			else{
				left = 800;
			}
			heigh = 90;

			$('.content2-2 h3').addClass('hidden');
			$('.content2-2 hr').addClass('hidden');
			$('.content2-2 i').removeClass('hidden');
			$('.content2-2 i').animate({opacity:1,height:50,marginTop:'10%'},500);
			$('.content2-2 > span').css('opacity',0);
			$('.content2-2 > span').addClass('hidden');
		}
		else{
			$('.content2-2 h3').removeClass('hidden').removeClass('h3center');
			$('.content2-2 hr').addClass('hidden');
			$('.content2-2 i').removeClass('hidden');
			$('.content2-2 i').removeAttr('style');
			$('.content2-2 > span').css('opacity',0);
			$('.content2-2 > span').addClass('hidden');
		}
	}
	else{
		$('.content2-2 h3').removeClass('hidden');
		$('.content2-2 > span').css('opacity',0);
		$('.content2-2 > span').addClass('hidden');
		$('.content2-2 i').removeClass('hidden')
		$('.content2-2 i').removeAttr('style')
		$('.content2-2 hr').addClass('hidden');
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realHeight2 = $(window).height() / bgHeight * heigh2;
	var realWidth = $(window).height() / bgHeight * width;
	var realWidth2 = $(window).height() / bgHeight * width2;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (isPhone == 1) {
		if (resize) {
			$('.content2-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content2-2').css({'top':realTop,'left':realLeft2,'height':realHeight2,'width':realWidth2,opacity:0});
			$('.content2-2').removeClass('hidden');
			$('.content2-2').animate({top:realTop,width:realWidth,height:realHeight,left:realLeft,opacity:1},600);
		}
	}
	else{
		if (resize) {
			$('.content2-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content2-2').css({'top':realTop2,'left':realLeft,'height':realHeight,'width':realWidth,opacity:0.3});
			$('.content2-2').removeClass('hidden');
			setTimeout(function () {
				$(".content2-2").animate({top:realTop,opacity:1},500);
			},500)
		}
	}
}

function page2_icon3(resize,phoneActive) {
	var width = 290;
	var width2 = 290;
	var heigh = 200;
	var heigh2 = 200;
	var top = 360;
	var top2 = 580;
	var left = 972;
	var left2 = 972;

	if (isPhone == 1) {
		left = 700;
		left2 = 760;
		top = 590;
		top2 = 590;
		width = 520;
		width2 = 520;
		heigh = 140;
		heigh2 = 140;

		if (phoneActive == 1) {
			top = 300;

			$('.content3-2 h3').removeClass('hidden').addClass('h3center');
			$('.content3-2 i').addClass('hidden');
		}
		else if (phoneActive == 2) {
			width = 90;
			top = 200;
			if (phoneActiveNum == 1 || phoneActiveNum == 2) {
				left = 800;
			}
			else{
				left = 900;
			}
			heigh = 90;

			$('.content3-2 h3').addClass('hidden');
			$('.content3-2 hr').addClass('hidden');
			$('.content3-2 i').removeClass('hidden');
			$('.content3-2 i').animate({opacity:1,height:50,marginTop:'10%'},500);
			$('.content3-2 > span').css('opacity',0);
			$('.content3-2 > span').addClass('hidden');
		}
		else{
			$('.content3-2 h3').removeClass('hidden').removeClass('h3center');
			$('.content3-2 hr').addClass('hidden');
			$('.content3-2 i').removeClass('hidden');
			$('.content3-2 i').removeAttr('style')
			$('.content3-2 > span').css('opacity',0);
			$('.content3-2 > span').addClass('hidden');
		}
	}
	else{
		$('.content3-2 h3').removeClass('hidden');
		$('.content3-2 > span').css('opacity',0);
		$('.content3-2 > span').addClass('hidden');
		$('.content3-2 i').removeClass('hidden')
		$('.content3-2 i').removeAttr('style')
		$('.content3-2 hr').addClass('hidden');
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realHeight2 = $(window).height() / bgHeight * heigh2;
	var realWidth = $(window).height() / bgHeight * width;
	var realWidth2 = $(window).height() / bgHeight * width2;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (isPhone == 1) {
		if (resize) {
			$('.content3-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content3-2').css({'top':realTop2,'left':realLeft2,'height':realHeight2,'width':realWidth2,opacity:0});
			$('.content3-2').removeClass('hidden');
			$(".content3-2").animate({top:realTop,left:realLeft,height:realHeight,width:realWidth,opacity:1},600);
		}
	}
	else{
		if (resize) {
			$('.content3-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content3-2').css({'top':realTop2,'left':realLeft,'height':realHeight,'width':realWidth,opacity:0.3});
			$('.content3-2').removeClass('hidden');
			setTimeout(function () {
				$(".content3-2").animate({top:realTop,opacity:1},500);
			},500)
		}
	}
}

function page2_icon4(resize,phoneActive) {
	var width = 290;
	var width2 = 290;
	var heigh = 200;
	var heigh2 = 200;
	var top = 360;
	var top2 = 360;
	var left = 1280;
	var left2 = 972;

	if (isPhone == 1) {
		left = 700;
		left2 = 760;
		top = 770;
		top2 = 770;
		width = 520;
		width2 = 520;
		heigh = 140;
		heigh2 = 140;

		if (phoneActive == 1) {
			top = 300;

			$('.content4-2 h3').removeClass('hidden').addClass('h3center');
			$('.content4-2 i').addClass('hidden');
		}
		else if (phoneActive == 2) {
			width = 90;
			top = 200;
			left = 900;
			heigh = 90;

			$('.content4-2 h3').addClass('hidden');
			$('.content4-2 hr').addClass('hidden');
			$('.content4-2 i').removeClass('hidden');
			$('.content4-2 i').animate({opacity:1,height:50,marginTop:'10%'},500);
			$('.content4-2 > span').css('opacity',0);
			$('.content4-2 > span').addClass('hidden');
		}
		else{
			$('.content4-2 h3').removeClass('hidden').removeClass('h3center');
			$('.content4-2 hr').addClass('hidden');
			$('.content4-2 i').removeClass('hidden')
			$('.content4-2 i').removeAttr('style')
			$('.content4-2 > span').css('opacity',0);
			$('.content4-2 > span').addClass('hidden');
		}
	}
	else{
		$('.content4-2 h3').removeClass('hidden');
		$('.content4-2 > span').css('opacity',0);
		$('.content4-2 > span').addClass('hidden');
		$('.content4-2 i').removeClass('hidden')
		$('.content4-2 i').removeAttr('style')
		$('.content4-2 hr').addClass('hidden');
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (isPhone == 1) {
		if (resize) {
			$('.content4-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content4-2').css({'top':realTop,'left':realLeft2,'height':realHeight,'width':realWidth,opacity:0});
			$('.content4-2').removeClass('hidden');
			$(".content4-2").animate({top:realTop,'left':realLeft,opacity:1},600);
		}
	}
	else{
		if (resize) {
			$('.content4-2').css({'top':realTop,'left':realLeft,'height':realHeight,'width':realWidth});
		}
		else{
			$('.content4-2').css({'top':realTop,'left':realLeft2,'height':realHeight,'width':realWidth,opacity:0.3});
			$('.content4-2').removeClass('hidden');
			setTimeout(function () {
				$(".content4-2").animate({left:realLeft,opacity:1},500);
			},500)
		}
	}
}


var page2btnHeith = 0;
var page2btn1 = 0;
function page2btnOpen() {
	if (page2btn1 == 1) {
		page2btn1 = 2;
	}

	if (page2onmouseover == 1 && page2btn1 == 0) {
		page2btnHeith = $('.content1-2').height();
		page2btn1 = 1;

		var rate = 0.6;

		if (isPhone == 1) {
			rate = 1.5;

			page2_icon1(false,1);
			page2_icon2(false,2);
			page2_icon3(false,2);
			page2_icon4(false,2);
		}
		
		$('.content1-2 i').animate({opacity:0,height:0,marginTop:0},500,function () {
			$('.content1-2 hr').removeClass('hidden');
			$('.content1-2 hr').animate({width:'92%'},300,function () {});
			$('.content1-2').animate({height:$('.content1-2 > span').height() + $('.content1-2').height() * rate},300,function () {
				$('.content1-2 > span').animate({opacity:1},300,function () {
					if (page2btn1 == 2) {
						page2btn1 = 0;
						page2btnClose();
					}
					else{
						page2btn1 = 0;
					}
				});
			});
		})
	}
}

function page2btnClose() {
	if (page2btn1 == 1) {
		page2btn1 = 2;
	}

	if (page2onmouseover == 1 && page2btn1 == 0) {
		page2btn1 = 1;

		$('.content1-2 hr').animate({width:'3%'},300,function () {
			$('.content1-2 hr').addClass('hidden');
			$('.content1-2 i').animate({opacity:1,height:50,marginTop:'15%'},500);
			$('.content1-2 > span').animate({opacity:0},300);
			$('.content1-2').animate({height:page2btnHeith},300,function () {
				if (page2btn1 == 2) {
					page2btn1 = 0;
					page2btnOpen();
				}
				else{
					page2btn1 = 0;
				}
			});
		})
	}
}

var page2btn2 = 0;
function page2btn2Open() {
	if (page2btn2 == 1) {
		page2btn2 = 2;
	}

	if (page2onmouseover == 1 && page2btn2 == 0) {
		page2btnHeith = $('.content2-2').height();
		page2btn2 = 1;

		var rate = 0.6;

		if (isPhone == 1) {
			rate = 1.5;

			page2_icon1(false,2);
			page2_icon2(false,1);
			page2_icon3(false,2);
			page2_icon4(false,2);
		}

		$('.content2-2 i').animate({opacity:0,height:0,marginTop:0},500,function () {
			$('.content2-2 hr').removeClass('hidden');
			$('.content2-2 hr').animate({width:'92%'},300,function () {});
			$('.content2-2').animate({height:$('.content2-2 > span').height() + $('.content2-2').height() * rate},300,function () {
				$('.content2-2 > span').animate({opacity:1},300,function () {
					if (page2btn2 == 2) {
						page2btn2 = 0;
						page2btn2Close();
					}
					else{
						page2btn2 = 0;
					}
				});
			});
		})
	}
}

function page2btn2Close() {
	if (page2btn2 == 1) {
		page2btn2 = 2;
	}

	if (page2onmouseover == 1 && page2btn2 == 0) {
		page2btn2 = 1;

		$('.content2-2 hr').animate({width:'3%'},300,function () {
			$('.content2-2 hr').addClass('hidden');
			$('.content2-2 i').animate({opacity:1,height:50,marginTop:'15%'},500);
			$('.content2-2 > span').animate({opacity:0},300);
			$('.content2-2').animate({height:page2btnHeith},300,function () {
				if (page2btn2 == 2) {
					page2btn2 = 0;
					page2btnOpen();
				}
				else{
					page2btn2 = 0;
				}
			});
		})
	}
}

var page2btn3 = 0;
function page2btn3Open() {
	if (page2btn3 == 1) {
		page2btn3 = 2;
	}

	if (page2onmouseover == 1 && page2btn3 == 0) {
		page2btnHeith = $('.content3-2').height();
		page2btn3 = 1;

		var rate = 0.6;

		if (isPhone == 1) {
			rate = 1.5;

			page2_icon1(false,2);
			page2_icon2(false,2);
			page2_icon3(false,1);
			page2_icon4(false,2);
		}

		$('.content3-2 i').animate({opacity:0,height:0,marginTop:0},500,function () {
			$('.content3-2 hr').removeClass('hidden');
			$('.content3-2 hr').animate({width:'92%'},300,function () {});
			$('.content3-2').animate({height:$('.content3-2 > span').height() + $('.content3-2').height() * rate},300,function () {
				$('.content3-2 > span').animate({opacity:1},300,function () {
					if (page2btn3 == 2) {
						page2btn3 = 0;
						page2btn3Close();
					}
					else{
						page2btn3 = 0;
					}
				});
			});
		})
	}
}

function page2btn3Close() {
	if (page2btn3 == 1) {
		page2btn3 = 2;
	}

	if (page2onmouseover == 1 && page2btn3 == 0) {
		page2btn3 = 1;

		$('.content3-2 hr').animate({width:'3%'},300,function () {
			$('.content3-2 hr').addClass('hidden');
			$('.content3-2 i').animate({opacity:1,height:50,marginTop:'15%'},500);
			$('.content3-2 > span').animate({opacity:0},300);
			$('.content3-2').animate({height:page2btnHeith},300,function () {
				if (page2btn3 == 2) {
					page2btn3 = 0;
					page2btn3Open();
				}
				else{
					page2btn3 = 0;
				}
			});
		})
	}
}

var page2btn4 = 0;
function page2btn4Open() {
	if (page2btn4 == 1) {
		page2btn4 = 2;
	}

	if (page2onmouseover == 1 && page2btn4 == 0) {
		page2btnHeith = $('.content4-2').height();
		page2btn4 = 1;

		var rate = 0.6;

		if (isPhone == 1) {
			rate = 1.5;

			page2_icon1(false,2);
			page2_icon2(false,2);
			page2_icon3(false,2);
			page2_icon4(false,1);
		}

		$('.content4-2 i').animate({opacity:0,height:0,marginTop:0},500,function () {
			$('.content4-2 hr').removeClass('hidden');
			$('.content4-2 hr').animate({width:'92%'},300,function () {});
			$('.content4-2').animate({height:$('.content4-2 > span').height() + $('.content4-2').height() * rate},300,function () {
				$('.content4-2 > span').animate({opacity:1},300,function () {
					if (page2btn4 == 2) {
						page2btn4 = 0;
						page2btn4Close();
					}
					else{
						page2btn4 = 0;
					}
				});
			});
		})
	}
}

function page2btn4Close() {
	if (page2btn4 == 1) {
		page2btn4 = 2;
	}

	if (page2onmouseover == 1 && page2btn4 == 0) {
		page2btn4 = 1;

		$('.content4-2 hr').animate({width:'3%'},300,function () {
			$('.content4-2 hr').addClass('hidden');
			$('.content4-2 i').animate({opacity:1,height:50,marginTop:'15%'},500);
			$('.content4-2 > span').animate({opacity:0},300);
			$('.content4-2').animate({height:page2btnHeith},300,function () {
				if (page2btn4 == 2) {
					page2btn4 = 0;
					page2btn4Open();
				}
				else{
					page2btn4 = 0;
				}
			});
		})
	}
}

function page3_title(resize) {
	var width = 271;
	var heigh = 134;
	var top = 132;
	var left = 829;

	if (isPhone == 1) {
		top -= 80;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	
	if (resize) {
		$('.3_title').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.3_title').css({'top':realTop,'left':realLeft -25,'width':realWidth + 50,'height':realHeight,'opacity':0.4});
		$(".3_title").animate({left:realLeft,width:realWidth,opacity:1},800);
	}
}

function page3_icon1(resize) {
	var width = 200;
	var heigh = 200;
	var top = 344;
	var left = 460;

	if (isPhone == 1) {
		top -= 120;
		left = 727;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	$('.3_icon1').css({'top':realTop,'left':realLeft,'height':realHeight});

	if (resize) {
		$('.3_icon1').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.3_icon1').css({'top':realTop -20,'left':realLeft,'height':realHeight,'opacity':0});
		$(".3_icon1").animate({top:realTop,opacity:1},800);
	}
}

function page3_icon2(resize) {
	var width = 200;
	var heigh = 200;
	var top = 344;
	var left = 727;

	if (isPhone == 1) {
		top -= 120;
		left = 994;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_icon2').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.3_icon2').css({'top':realTop -20,'left':realLeft,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".3_icon2").animate({top:realTop,opacity:1},800);
		},500)
	}
}

function page3_icon3(resize) {
	var width = 200;
	var heigh = 200;
	var top = 344;
	var left = 994;

	if (isPhone == 1) {
		top += 220;
		left = 727;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_icon3').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.3_icon3').css({'top':realTop -20,'left':realLeft,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".3_icon3").animate({top:realTop,opacity:1},800);
		},1000)
	}
}

function page3_icon4(resize) {
	var width = 200;
	var heigh = 200;
	var top = 344;
	var left = 1261;

	if (isPhone == 1) {
		top += 220;
		left = 994;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_icon4').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.3_icon4').css({'top':realTop -20,'left':realLeft,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".3_icon4").animate({top:realTop,opacity:1},800);
		},1500)
	}
}

function page3_content1(resize) {
	var width = 210;
	var top = 579;
	var left = 460;

	if (isPhone == 1) {
		top -= 140;
		left = 727;
		width += 10;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	
	if (resize) {
		$('.3_content1').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.3_content1').css({'top':realTop,'left':realLeft,'width':realWidth,'opacity':0});
		$(".3_content1").animate({opacity:1},800);
		setTimeout(function () {
			$(".3_content1").animate({opacity:1},800);
		},500)
	}
}

function page3_content2(resize) {
	var width = 210;
	var top = 579;
	var left = 727;

	if (isPhone == 1) {
		top -= 140;
		left = 994;
		width += 10;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_content2').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.3_content2').css({'top':realTop,'left':realLeft,'width':realWidth,'opacity':0});
		setTimeout(function () {
			$(".3_content2").animate({opacity:1},800);
		},1000)
	}
}

function page3_content3(resize) {
	var width = 230;
	var top = 579;
	var left = 994;

	if (isPhone == 1) {
		top += 190;
		left = 727;
		width += 10;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_content3').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.3_content3').css({'top':realTop,'left':realLeft,'width':realWidth,'opacity':0});
		setTimeout(function () {
			$(".3_content3").animate({opacity:1},800);
		},1500)
	}
}

function page3_content4(resize) {
	var width = 210;
	var top = 579;
	var left = 1261;

	if (isPhone == 1) {
		top += 190;
		left = 994;
		width += 10;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.3_content4').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.3_content4').css({'top':realTop,'left':realLeft,'width':realWidth,'opacity':0});
		setTimeout(function () {
			$(".3_content4").animate({opacity:1},800);
		},2000)
	}
}

function page3_bottom() {
	var width = 1000;
	var top = 760;
	var left = 460;

	var realWidth = $(window).height() / bgHeight * width;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	$('.page3bottom').css({'top':realTop,'left':realLeft,'width':realWidth});
}

function page4_title(resize) {
	var width = 284;
	var heigh = 142;
	var top = 140;
	var left = 825;

	if (isPhone == 1) {
		top -= 80;
	}

	var realWidth = $(window).height() / bgHeight * width;
	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	
	if (resize) {
		$('.4_title').css({'top':realTop,'left':realLeft,'width':realWidth});
	}
	else{
		$('.4_title').css({'top':realTop,'left':realLeft -25,'width':realWidth + 50,'height':realHeight,'opacity':0.4});
		$(".4_title").animate({left:realLeft,width:realWidth,opacity:1},800);
	}
}

function page4_icon1(resize) {
	var width = 380;
	var heigh = 190;
	var top = 363;
	var left = 360;
	var left2 = 360;

	if (isPhone == 1) {
		top = 240;
		heigh = 170;
		left = 790;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (resize) {
		$('.4_icon1').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon1').css({'top':realTop,'left':realLeft2,'height':realHeight,'opacity':0});
		$(".4_icon1").animate({left:realLeft,opacity:1},800);
	}
}

function page4_icon2(resize) {
	var width = 380;
	var heigh = 190;
	var top = 363;
	var left = 770;
	var left2 = 360;

	if (isPhone == 1) {
		heigh = 170;
		left = 870;
		top = 353;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (resize) {
		$('.4_icon2').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon2').css({'top':realTop,'left':realLeft2,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".4_icon2").animate({left:realLeft,opacity:1},800);
		},500)
	}
}

function page4_icon3(resize) {
	var width = 380;
	var heigh = 190;
	var top = 363;
	var left = 1180;
	var left2 = 360;

	if (isPhone == 1) {
		heigh = 170;
		left = 800;
		top = 460;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (resize) {
		$('.4_icon3').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon3').css({'top':realTop,'left':realLeft2,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".4_icon3").animate({left:realLeft,opacity:1},800);
		},1000)
	}
}

function page4_icon4(resize) {
	var width = 380;
	var heigh = 190;
	var top = 592;
	var left = 360;
	var top2 = 363;

	if (isPhone == 1) {
		heigh = 170;
		left = 700;
		top = 570;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	if (resize) {
		$('.4_icon4').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon4').css({'top':realTop,'left':realLeft,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".4_icon4").animate({top:realTop,opacity:1},800);
		},1500)
	}
}

function page4_icon5(resize) {
	var width = 380;
	var heigh = 190;
	var top = 592;
	var left = 770;
	var left2 = 360;
	var top2 = 363;

	if (isPhone == 1) {
		heigh = 170;
		left = 750;
		top = 680;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (resize) {
		$('.4_icon5').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon5').css({'top':realTop2,'left':realLeft2,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".4_icon5").animate({top:realTop,left:realLeft,opacity:1},800);
		},1200)
	}
}

function page4_icon6(resize) {
	var width = 380;
	var heigh = 190;
	var top = 592;
	var left = 1180;
	var left2 = 360;
	var top2 = 363;

	if (isPhone == 1) {
		heigh = 170;
		left = 790;
		top = 790;
	}

	var realHeight = $(window).height() / bgHeight * heigh;
	var realTop = $(window).height() / bgHeight * top;
	var realTop2 = $(window).height() / bgHeight * top2;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;
	var realLeft2 = $(window).height() / bgHeight * left2 - hideBgWidth / 2;

	if (resize) {
		$('.4_icon6').css({'top':realTop,'left':realLeft,'height':realHeight});
	}
	else{
		$('.4_icon6').css({'top':realTop2,'left':realLeft2,'height':realHeight,'opacity':0});
		setTimeout(function () {
			$(".4_icon6").animate({top:realTop,left:realLeft,opacity:1},800);
		},800)
	}
}

function page5right(resize) {
	var top = 150;
	var left = 1100;
	if ($(window).height() < 870) {
		top = 20;
		left = 1096;

		if (isPhone == 1) {
			left = 700;
		}
	}

	var realTop = $(window).height() / bgHeight * top;
	var realLeft = $(window).height() / bgHeight * left - hideBgWidth / 2;

	$('.page5right').css({'top':realTop,'left':realLeft});
}

function playAnimate() {
	$('.page2 > div').addClass('hidden');
	page2onmouseover = 0;
	if (pageNum == 0) {
		page1Logo();
		page1AboutUs();
		page1Describe();
	}
	else if (pageNum == 1) {
		page2_title();
		page2_icon1();
		page2_icon2();
		page2_icon3();
		page2_icon4();
	}
	else if (pageNum == 2) {
		page3_title();
		page3_icon1();
		page3_icon2();
		page3_icon3();
		page3_icon4();

		page3_content1();
		page3_content2();
		page3_content3();
		page3_content4();
	}
	else if (pageNum == 3) {
		page4_title();

		page4_icon1();
		page4_icon2();
		page4_icon3();
		page4_icon4();
		page4_icon5();
		page4_icon6();
	}
	
	menu();
}

function listener () {
	var startX, startY, endX, endY;
	document.getElementById('investment').addEventListener('touchstart', touchStart, false);
	document.getElementById('investment').addEventListener('touchmove', touchMove, false);
	document.getElementById('investment').addEventListener('touchend', touchEnd, false);
	function touchStart(event) {
		var touch = event.touches[0];
		startY = touch.pageY;
		startX = touch.pageX;
	}
	function touchMove(event) {
		var touch = event.touches[0];
		endY = (startY - touch.pageY);
		endX = touch.pageX;
		moveY = touch.pageY - startY;
		moveX = touch.pageX - startX;


		if (moveY > 80 || moveX > 80) {
			if (i == 0) {
				i = 1;

				if (pageNum == 0) {
					i = 0;
				}
				else{
					pageNum -= 1;
					$(".page1").animate({marginTop:$(window).height() * pageNum * -1},800,function () {
						i = 0;
						playAnimate();
					});
				}
			}
		}
		else if (moveY < -80 || moveX < -80) {
			if (i == 0) {
				i = 1;

				if (pageNum == 4) {
					i = 0;
				}
				else{
					pageNum += 1;
					$(".page1").animate({marginTop:$(window).height() * pageNum * -1},800,function () {
						i = 0;
						playAnimate();
					});
				}
			}
		}
	}
	function touchEnd(event) {
	}
}

$(document).ready(function() {
	if ($(window).width() <= 1000) {
		isPhone = 1;
	}

	document.body.ontouchmove=function(e){
		e.preventDefault();
	}

	$('.js-package').investment();
	$('.investment').css('height',$(window).height());
	$('.investment > div').css('height',$(window).height());

	$('input').iCheck({
		checkboxClass: 'icheckbox_flat-red',
		radioClass: 'iradio_flat-red'
	});
	
	page1Logo();
	page1AboutUs();
	page1Describe();
	menu();

	page2_title(true);
	page2_icon1(true);
	page2_icon2(true);
	page2_icon3(true);
	page2_icon4(true);

	page3_title(true);
	page3_icon1(true);
	page3_icon2(true);
	page3_icon3(true);
	page3_icon4(true);
	page3_content1(true);
	page3_content2(true);
	page3_content3(true);
	page3_content4(true);
	page3_bottom(true);

	page4_title(true);
	page4_icon1(true);
	page4_icon2(true);
	page4_icon3(true);
	page4_icon4(true);
	page4_icon5(true);
	page4_icon6(true);

	page5right(true);

	$('.content1-2').mouseenter(function () {
		if(isPhone == 0){
			$('.content1-2 span').removeClass('hidden');
			page2btnOpen();
		}
	});

	$('.content1-2').click(function () {
		if(isPhone == 1){
			phoneActiveNum = 1;
			$('.content1-2 span').removeClass('hidden');
			page2btnOpen();
		}
	});

	$(".content1-2").mouseleave(function () {
		if(isPhone == 0){
			$('.content1-2 span').addClass('hidden');
			page2btnClose();
		}
	});

	$(".content2-2").mouseenter(function () {
		if(isPhone == 0){
			$('.content2-2 span').removeClass('hidden');
			page2btn2Open();
		}
	});

	$('.content2-2').click(function () {
		if(isPhone == 1){
			phoneActiveNum = 2;
			$('.content2-2 span').removeClass('hidden');
			page2btn2Open();
		}
	});

	$(".content2-2").mouseleave(function () {
		if(isPhone == 0){
			$('.content2-2 span').addClass('hidden');
			page2btn2Close();
		}
	});

	$(".content3-2").mouseenter(function () {
		if(isPhone == 0){
			$('.content3-2 span').removeClass('hidden');
			page2btn3Open();
		}
	});

	$(".content3-2").click(function () {
		if(isPhone == 1){
			phoneActiveNum = 3;
			$('.content3-2 span').removeClass('hidden');
			page2btn3Open();
		}
	});

	$(".content3-2").mouseleave(function () {
		if(isPhone == 0){
			$('.content3-2 span').addClass('hidden');
			page2btn3Close();
		}
	});

	$(".content4-2").mouseenter(function () {
		if(isPhone == 0){
			$('.content4-2 span').removeClass('hidden');
			page2btn4Open();
		}
	});

	$(".content4-2").click(function () {
		if(isPhone == 1){
			phoneActiveNum = 4;
			$('.content4-2 span').removeClass('hidden');
			page2btn4Open();
		}
	});

	$(".content4-2").mouseleave(function () {
		if(isPhone == 0){
			$('.content4-2 span').addClass('hidden');
			page2btn4Close();
		}
	});

	$('.menu li').click(function () {
		if (i == 0) {
			i = 1;
			pageNum = $(this).data('page');
			$(".page1").animate({marginTop:$(window).height() * pageNum * -1},800,function () {
				i = 0;
				playAnimate();
			});
		}
	});
	
	var loghandle = function(event, delta) {
		if (i == 0) {
			i = 1;

			if (delta > 0){
				if (pageNum == 0) {
					i = 0;
				}
				else{
					pageNum -= 1;
					$(".page1").animate({marginTop:$(window).height() * pageNum * -1},800,function () {
						i = 0;
						playAnimate();
					});
				}
			}
			else if (delta < 0){
				if (pageNum == 4) {
					pageNum = 0;
				}
				else{
					pageNum += 1;
				}

				$(".page1").animate({marginTop:$(window).height() * pageNum * -1},800,function () {
					i = 0;
					playAnimate();
				});
			}
		}
	};

	listener();

	$(document).mousewheel(function(event, delta) {
		loghandle(event, delta);
	});
});

$( window ).resize(function() {
	if ($(window).width() <= 1000) {
		isPhone = 1;
	}
	else{
		isPhone = 0;
	}

	realBgWidth = bgWidth / bgHeight * $(window).height();
	hideBgWidth = realBgWidth - $(window).width();

	$('.investment').css( 'height',$(window).height() );
	$('.investment > div').css( 'height',$(window).height() );
	$('.investment .page1').css( 'margin-top',$(window).height() * pageNum * -1 );

	page1Logo(true);
	page1AboutUs(true);
	page1Describe(true);
	menu(true);
	page2_title(true);
	page2_icon1(true);
	page2_icon2(true);
	page2_icon3(true);
	page2_icon4(true);

	page3_title(true);
	page3_icon1(true);
	page3_icon2(true);
	page3_icon3(true);
	page3_icon4(true);
	page3_content1(true);
	page3_content2(true);
	page3_content3(true);
	page3_content4(true);
	page3_bottom(true);

	page4_title(true);
	page4_icon1(true);
	page4_icon2(true);
	page4_icon3(true);
	page4_icon4(true);
	page4_icon5(true);
	page4_icon6(true);

	page5right(true);
});