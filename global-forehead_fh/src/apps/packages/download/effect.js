$(function () {
    //initialization
    var window_width = $(window).innerWidth();
    var window_height = $(window).innerHeight();
    var $main_contain = $(".main_contain");
    var $con_lump = $(".con_lump");
    var $loading = $(".loading");

    var $PCDownloadBtn = $('.js-dc-pc-download');
    var url = _('/yb.exe').toLink();
    $PCDownloadBtn.attr('href',url);

    var clear_page_01;
    var clear_page_02;
    var clear_page_03;

    $loading.css({
        "top": (window_height / 2 - 74) + "px",
        "left": (window_width / 2 - 74) + "px"
    });
    $main_contain.css({
        "width": window_width + "px",
        "height": window_height + "px"
    });
    //alert("window_width:"+window_width+',$con_lump.width():'+$con_lump.width())
    //$con_lump.css({
    //    "left": (window_width / 2 - $con_lump.width() / 2) + "px"
    //});

    //loading
    var $all_img = $("img");
    var all_img_length = $all_img.length;
    var loading_count = 0;

    function loading() {
        $all_img.load(function () {
            loading_count++;
            if (loading_count >= all_img_length) {
                $loading.animate({
                    "opacity": "0"
                }, 500, function () {
                    $loading.hide();
                    $main_contain.animate({
                        "opacity": "1"
                    }, 500, function () {
                        //先启动第一页动画
                        clear_page_01 = setInterval(effectPage01, 50);
                    });
                })
            }
        });
    }

    loading();

    //页面1效果
    var $pc_bg = $(".pc_bg img");
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
    var $ios_bg = $(".ios_bg img");
    var ios_speed = 1;
    var ios_num = 0.001;

    function effectPage02() {
        if (parseInt(ios_speed * 10) > 12) {
            ios_num *= -1;
        }
        if (parseInt(ios_speed * 10) < 10) {
            ios_num *= -1;
        }
        ios_speed += ios_num;
        $ios_bg.css("transform", "scale(" + ios_speed + ")");
    }

    var $ios_line = $(".ios_line");
    var $ios_line_ele = $(".ios_line_lump > div");
    $ios_line.css("opacity", "0");
    $ios_line_ele.css("opacity", "0");
    $ios_line.css("width", "0px");

    function iosLineEffect() {
        $ios_line.animate({
            "width": "1920px",
            "opacity": "1"
        }, 2000, function () {
            $ios_line_ele.eq(0).animate({
                "opacity": "1"
            }, 500, function () {
                $ios_line_ele.eq(1).animate({
                    "opacity": "1"
                }, 500, function () {
                    $ios_line_ele.eq(2).animate({
                        "opacity": "1"
                    }, 500, function () {
                        $ios_line.css("opacity", "1");
                        $ios_line_ele.css("opacity", "1");
                    });
                });
            });
        });
    }

    //页面3效果
    var $android_bg = $(".android_bg img");
    var android_speed = 1;
    var android_num = 0.001;

    function effectPage03() {
        if (parseInt(android_speed * 10) > 12) {
            android_num *= -1;
        }
        if (parseInt(android_speed * 10) < 10) {
            android_num *= -1;
        }
        android_speed += android_num;
        $android_bg.css("transform", "scale(" + android_speed + ")");
    }

    var $android_line = $(".android_line");
    var $android_line_ele = $(".android_line_lump > div");
    $android_line.css("opacity", "0");
    $android_line_ele.css("opacity", "0");
    $android_line.css("width", "0px");

    function androidLineEffect() {
        $android_line.animate({
            "width": "1920px",
            "opacity": "1"
        }, 2000, function () {
            $android_line_ele.eq(0).animate({
                "opacity": "1"
            }, 500, function () {
                $android_line_ele.eq(1).animate({
                    "opacity": "1"
                }, 500, function () {
                    $android_line_ele.eq(2).animate({
                        "opacity": "1"
                    }, 500, function () {
                        $android_line.css("opacity", "1");
                        $android_line_ele.css("opacity", "1");
                    });
                });
            });
        });
    }

    //页面4效果
    var $address_01 = $(".address_01");
    var $address_02 = $(".address_02");
    var $address_03 = $(".address_03");
    var $address_04 = $(".address_04");
    var $address_05 = $(".address_05");
    var $address_06 = $(".address_06");

    var addressMovingArr = [function () {
        $address_01.animate({
            "top": "453px",
            "left": "300px",
            "opacity": "1"
        }, 500, setAddressMoving)
    }, function () {
        $address_02.animate({
            "top": "570px",
            "left": "185px",
            "opacity": "1"
        }, 500, setAddressMoving)
    }, function () {
        $address_03.animate({
            "top": "635px",
            "left": "298px",
            "opacity": "1"
        }, 500, setAddressMoving)
    }, function () {
        $address_04.animate({
            "top": "303px",
            "left": "1108px",
            "opacity": "1"
        }, 500, setAddressMoving)
    }, function () {
        $address_05.animate({
            "top": "420px",
            "left": "1135px",
            "opacity": "1"
        }, 500, setAddressMoving)
    }, function () {
        $address_06.animate({
            "top": "485px",
            "left": "1108px",
            "opacity": "1"
        }, 500,setAddressMoving)
    },function(){
        $(".wap_decoration").animate({
            "top": "-200px",
            "opacity": "1"
        }, 500)
    }
    ];

    //队列计数
    function setAddressMoving() {
        $(".wap_pic").dequeue("addressQueue");
    }

    $(".wap_pic").queue("addressQueue", addressMovingArr);

    //菜单按钮
    var $ele_con_contain = $(".ele_con_contain");
    var $ele_con_lump = $(".ele_con_lump");
    var $menu = $(".menu li");
    $menu.click(function () {
        clearInterval(clear_page_01);
        clearInterval(clear_page_02);
        clearInterval(clear_page_03);

        var btn_index = $menu.index($(this));
        $menu.removeClass("current");
        $(this).addClass("current");
        $ele_con_lump.eq(btn_index).prependTo($ele_con_contain);
        $ele_con_lump.css("opacity", "0");
        $ele_con_lump.css("display", "none");
        $ele_con_lump.eq(btn_index).css("display", "block");
        $ele_con_lump.eq(btn_index).animate({
            "opacity": "1"
        }, 500, function () {
            switch (btn_index) {
                case 0:
                    clear_page_01 = setInterval(effectPage01, 50);
                    break;
                case 1:
                    clear_page_02 = setInterval(effectPage02, 50);
                    iosLineEffect();
                    break;
                case 2:
                    clear_page_03 = setInterval(effectPage03, 50);
                    androidLineEffect();
                    break;
                case 3:
                    setAddressMoving();
                    break;
            }
        })
    });

});