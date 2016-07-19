$(function () {
    var $container = $(".container");
    var $all_li = $container.find("li");
    var $ul = $container.find("ul");
    var $li_con = $(".li_con");
    var li_length = $all_li.length;
    var window_width = $(window).innerWidth();
    var window_height = $(window).innerHeight();
    var ul_height = li_length * window_height;
    var $btn_ele = $(".btn_ele");
    var current_num = 0;

    var $bottom_btn = $(".bottom_btn");
    console.log($all_li.height());
    $bottom_btn.css("top", ($all_li.height() - 84) + "px");

    $container.css({
        "width": window_width + "px",
        "height": window_height + "px"
    });
    $ul.css({
        "width": window_width + "px",
        "height": ul_height + "px"
    });
    $li_con.css({
        "height": window_height + "px"
    });
    $all_li.css({
        "width": window_width + "px",
        "height": window_height + "px"
    });

    //分页动画
    function ele_animate(num) {
        switch (num) {
            case 0:
                break;
            case 1:
                $(".ele_02_icon").animate({
                    "opacity": "1",
                    "left": "10%"
                }, function () {
                    $(".ele_02_text").animate({
                        "opacity": "1",
                        "top": "35%"
                    });
                });
                break;
            case 2:
                $(".ele_03_icon").animate({
                    "opacity": "1",
                    "right": "0%"
                }, function () {
                    $(".ele_03_text").animate({
                        "opacity": "1",
                        "top": "35%"
                    });
                });
                break;
            case 3:
                $(".ele_04_icon").animate({
                    "opacity": "1",
                    "left": "10%"
                }, function () {
                    $(".ele_04_text").animate({
                        "opacity": "1",
                        "top": "35%"
                    });
                });
                break;
            case 4:
                $(".ele_05_icon").animate({
                    "opacity": "1",
                    "right": "0%"
                }, function () {
                    $(".ele_05_text").animate({
                        "opacity": "1",
                        "top": "35%"
                    });
                });
                break;
            case 5:
                $(".ele_06_icon").animate({
                    "opacity": "1",
                    "left": "10%"
                }, function () {
                    $(".ele_06_text").animate({
                        "opacity": "1",
                        "top": "35%"
                    });
                });
                break;
            case 6:
                $(".ele_07_icon").animate({
                    "opacity": "1",
                    "left": "0%"
                }, function () {
                    $(".ele_07_qrcode").animate({
                        "opacity": "1",
                        "left": "580px"
                    }, function () {
                        $(".ele_07_text").animate({
                            "opacity": "1",
                            "bottom": "43%"
                        });
                    });
                });
                break;
        }
    }

    ele_animate(0);
    //滚动函数
    function wheel(event, delta) {
        if (parseInt($ul.css("top")) <= 0 && parseInt($ul.css("top")) >= (-(window_height * 6))) {
            if (delta == -1) {
                if (parseInt($ul.css("top")) >= (-(window_height * 5))) {
                    current_num++;
                    $container.unbind("mousewheel");
                    $ul.animate({
                        "top": "-=" + window_height + "px"
                    }, 500, function () {
                        $container.bind("mousewheel", function (event, delta) {
                            wheel(event, delta);
                        });
                        $btn_ele.removeClass("btn_current");
                        $btn_ele.eq(current_num).addClass("btn_current");
                        ele_animate(current_num);
                    });
                }
            }
            if (delta == 1) {
                if (parseInt($ul.css("top")) < 0) {
                    current_num--;
                    $container.unbind("mousewheel");
                    $ul.animate({
                        "top": "+=" + window_height + "px"
                    }, 500, function () {
                        $container.bind("mousewheel", function (event, delta) {
                            wheel(event, delta);
                        });
                        $btn_ele.removeClass("btn_current");
                        $btn_ele.eq(current_num).addClass("btn_current");
                        ele_animate(current_num);
                    });
                }

            }
        }
    }

    $container.bind("mousewheel", function (event, delta) {
        wheel(event, delta);
    });

    $btn_ele.click(function () {
        var num = $btn_ele.index($(this));
        current_num = num;
        var move_duration = num * window_height;
        $btn_ele.removeClass("btn_current");
        $btn_ele.eq(num).addClass("btn_current");

        $container.unbind("mousewheel");
        $ul.animate({
            "top": "-" + move_duration + "px"
        }, 500, function () {
            $container.bind("mousewheel", function (event, delta) {
                wheel(event, delta);
            });
            ele_animate(current_num);
        });
    });

    //第一页效果
    var $small_ele = $(".ele_01_left,.ele_01_middle,.ele_01_right");
    var $big_ele = $(".phone_pop_01");

    $(".ele_01_left").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(0).css("z-index", "10");
        $big_ele.eq(0).animate({
            "opacity": "1"
        }, function () {
            $small_ele.css("opacity", "0")
        });
    });
    $(".ele_01_middle").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(1).css("z-index", "10");
        $big_ele.eq(1).animate({
            "opacity": "1"
        }, function () {
            $small_ele.css("opacity", "0")
        });
    });
    $(".ele_01_right").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(2).css("z-index", "10");
        $big_ele.eq(2).animate({
            "opacity": "1"
        }, function () {
            $small_ele.css("opacity", "0")
        });
    });

    $(".ele_01_left_small").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(0).css("z-index", "10");
        $big_ele.eq(0).animate({
            "opacity": "1"
        }, function () {
            $big_ele.eq(1).css("opacity", "0");
            $big_ele.eq(2).css("opacity", "0");
        });
    });
    $(".ele_01_middle_small").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(1).css("z-index", "10");
        $big_ele.eq(1).animate({
            "opacity": "1"
        }, function () {
            $big_ele.eq(0).css("opacity", "0");
            $big_ele.eq(2).css("opacity", "0");
        });
    });
    $(".ele_01_right_small").mouseover(function () {
        $big_ele.css("z-index", "0");
        $big_ele.eq(2).css("z-index", "10");
        $big_ele.eq(2).animate({
            "opacity": "1"
        }, function () {
            $big_ele.eq(0).css("opacity", "0");
            $big_ele.eq(1).css("opacity", "0");
        });
    });
});