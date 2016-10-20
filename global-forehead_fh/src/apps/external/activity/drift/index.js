"use strict";

var config = require('com/driftActivity/config');

var DriftView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-get-prize': 'getPrizeHandler'
  },

  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/info/bottleactivity/info.json',
      data: {
        activityId: this.options.activityId
      }
    });
  },

  getPrizeXhr: function() {
    return Global.sync.ajax({
      url: '/info/bottleactivity/doget.json',
      data: {
        activityId: this.options.activityId
      }
    });
  },

  initialize: function() {
    var self = this;
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
      window.setTimeout(function() {
        self._onRender();
      }, 10);
    });
  },

  updateInfo: function() {
    var self = this;
    this.getInfoXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          var data = self.data = res.root;
          self.$('.js-from-date').text(_(data.fromDate).toDate('MM月DD日'));
          self.$('.js-end-date').text(_(data.endDate).toDate('MM月DD日'));
          self.$('.js-bonus-limit').text(_(data.bonusLimit).convert2yuan());
          self.bonusLimit = data.bonusLimit;
        }
      });
  },

  _onRender: function() {
    var self = this;

    this.updateInfo();
    setInterval(function() {
      self.updateInfo();
    }, 30000);


    var $river_ele_01 = $(".river_ele_01");
    var $river_ele_02 = $(".river_ele_02");
    var $river_ele_03 = $(".river_ele_03");
    var river_ele_01_left = parseInt($river_ele_01.css("left"));
    var river_ele_02_left = parseInt($river_ele_02.css("left"));
    var river_ele_03_left = parseInt($river_ele_03.css("left"));

    var $bottle_lump = $(".bottle_lump");
    console.log($bottle_lump.css("left"));

    var cur_window_left = $(window).innerWidth();
    $bottle_lump.css("left",(cur_window_left / 2 - $bottle_lump.width() /2) + "px");

    var $god_bottom_01 = $(".god_bottle_01");
    var $god_bottom_02 = $(".god_bottle_02");
    var $god_bottom_03 = $(".god_bottle_03");

    function riverAnimate_01() {
      var num = 0;
      setInterval(function () {
        if (num >= 68) {
          num = 0;
          $river_ele_01.css("left", (river_ele_01_left) + "px");
        } else {
          num++;
          $river_ele_01.css("left", (num + river_ele_01_left) + "px");
        }
      }, 50);
    }

    function riverAnimate_02() {
      var num = 0;
      setInterval(function () {
        if (num <= -68) {
          num = 0;
          $river_ele_02.css("left", (river_ele_02_left) + "px");
        } else {
          num--;
          $river_ele_02.css("left", (num - river_ele_02_left) + "px");
        }
      }, 50);
    }

    function riverAnimate_03() {
      var num = 0;
      setInterval(function () {
        if (num >= 68) {
          num = 0;
          $river_ele_03.css("left", (river_ele_03_left) + "px");
        } else {
          num++;
          $river_ele_03.css("left", (num + river_ele_03_left) + "px");
        }
      }, 30);
    }

    function godBottomAnimate_01() {
      var deg = 0;
      var high_top = 240;
      var end_top = 600;
      var init_left = parseInt($god_bottom_01.css("left"));
      var init_top = parseInt($god_bottom_01.css("top"));
      var cur_left = init_left;
      var cur_top = init_top;
      var changePath = false;
      var clear_rotate;
      var clear_animate;
      clear_rotate = setInterval(function () {
        if (deg >= 360) {
          deg = 0;
          $god_bottom_01.css("transform", "rotate(0deg)");
        } else {
          deg++;
          $god_bottom_01.css("transform", "rotate(" + deg + "0deg)");
        }
      }, 30);
      clear_animate = setInterval(function () {
        cur_left += 3;
        $god_bottom_01.css("left", cur_left + "px");
        if (changePath) {
          if (cur_top <= end_top) {
            cur_top += 3;
            $god_bottom_01.css("top", cur_top + "px");
          } else {
            changePath = false;
            cur_top = init_top;
            cur_left = init_left;
            $god_bottom_01.css("top", init_top + "px")
            $god_bottom_01.css("left", init_left + "px");
            clearInterval(clear_rotate);
            clearInterval(clear_animate);
            setTimeout(godBottomAnimate_01, 5000);
          }
        } else {
          if (cur_top >= high_top) {
            cur_top -= 2;
            $god_bottom_01.css("top", cur_top + "px");
          } else {
            changePath = true;
          }
        }
      }, 30);
    }

    function godBottomAnimate_02() {
      var deg = 0;
      var high_top = 240;
      var end_top = 600;
      var init_left = parseInt($god_bottom_02.css("left"));
      var init_top = parseInt($god_bottom_02.css("top"));
      var cur_left = init_left;
      var cur_top = init_top;
      var changePath = false;
      var clear_rotate;
      var clear_animate;
      clear_rotate = setInterval(function () {
        if (deg <= -360) {
          deg = 0;
          $god_bottom_02.css("transform", "rotate(0deg)");
        } else {
          deg--;
          $god_bottom_02.css("transform", "rotate(" + deg + "0deg)");
        }
      }, 30);
      clear_animate = setInterval(function () {
        cur_left -= 3;
        $god_bottom_02.css("left", cur_left + "px");
        if (changePath) {
          if (cur_top <= end_top) {
            cur_top += 3;
            $god_bottom_02.css("top", cur_top + "px");
          } else {
            changePath = false;
            cur_top = init_top;
            cur_left = init_left;
            $god_bottom_02.css("top", init_top + "px")
            $god_bottom_02.css("left", init_left + "px");
            clearInterval(clear_rotate);
            clearInterval(clear_animate);
            setTimeout(godBottomAnimate_02, 3000);
          }
        } else {
          if (cur_top >= high_top) {
            cur_top -= 2;
            $god_bottom_02.css("top", cur_top + "px");
          } else {
            changePath = true;
          }
        }
      }, 30);
    }

    function godBottomAnimate_03() {
      var deg = 0;
      var high_top = 180;
      var end_top = 600;
      var init_left = parseInt($god_bottom_03.css("left"));
      var init_top = parseInt($god_bottom_03.css("top"));
      var cur_left = init_left;
      var cur_top = init_top;
      var changePath = false;
      var clear_rotate;
      var clear_animate;
      clear_rotate = setInterval(function () {
        if (deg <= -360) {
          deg = 0;
          $god_bottom_03.css("transform", "rotate(0deg)");
        } else {
          deg--;
          $god_bottom_03.css("transform", "rotate(" + deg + "0deg)");
        }
      }, 30);
      clear_animate = setInterval(function () {
        cur_left -= 3;
        $god_bottom_03.css("left", cur_left + "px");
        if (changePath) {
          if (cur_top <= end_top) {
            cur_top += 3;
            $god_bottom_03.css("top", cur_top + "px");
          } else {
            changePath = false;
            cur_top = init_top;
            cur_left = init_left;
            $god_bottom_03.css("top", init_top + "px")
            $god_bottom_03.css("left", init_left + "px");
            clearInterval(clear_rotate);
            clearInterval(clear_animate);
            setTimeout(godBottomAnimate_03, 7000);
          }
        } else {
          if (cur_top >= high_top) {
            cur_top -= 2;
            $god_bottom_03.css("top", cur_top + "px");
          } else {
            changePath = true;
          }
        }
      }, 30);
    }

    riverAnimate_01();
    riverAnimate_02();
    riverAnimate_03();

    godBottomAnimate_01();
    setTimeout(godBottomAnimate_02,2000);
    setTimeout(godBottomAnimate_03,4000);


    var $close_btn = $(".pop_close");
    var $mask = this.$mask = $(".fullscreen_mask");
    var $pop = this.$pop = $(".pop_window");
    var $sure_btn = $(".pop_btn");
    var $pop_text = this.$pop_text = $(".pop_text");

    $sure_btn.click(function () {
      $mask.hide();
      $pop.hide();
    });

    $close_btn.click(function () {
      $mask.hide();
      $pop.hide();
    });
  },

  getInfor: function(num, money, bottleInfo) {
    var window_width = $(window).innerWidth();
    var window_height = $(window).innerHeight();
    var pop_infor_text;

    this.$pop.css({
      "left": ((window_width - this.$pop.width()) / 2) + "px",
      "top": ((window_height - this.$pop.height()) / 2) + "px"
    });

    switch (num) {
      case 1:
        pop_infor_text = '您还未集齐五福字帖<br>暂无法领取奖励！<br />';
        if (bottleInfo) {
          bottleInfo = bottleInfo.split(',');
          pop_infor_text += '您已集齐：' + _(bottleInfo).map(function(bottleId) {
              return config.getById(Number(bottleId)).name;
            }).join(' ');
        }
        break;
      case 2:
        pop_infor_text = '您今天的消费还未达到' + _(this.bonusLimit).convert2yuan() + '元<br>请完成消费后再来领取吧！';
        break;
      case 0:
        pop_infor_text = '恭喜您领取到' + _(money).convert2yuan() + '元额外奖励<br>已打入平台帐户。<br>明天还可以领哦，加油！ ';
        break;
      case 3:
        pop_infor_text = '您已经领取过今天的奖励了，请明天再来领吧！';
        break;
    }

    return pop_infor_text;
  },

  getPrizeHandler: function(e) {
    var self = this;
    this.getPrizeXhr()
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root && res.root[0] || {};
          self.$mask.show();
          self.$pop.show();
          self.$pop_text.html(self.getInfor(data.result, data.money, data.bottleInfo));

        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  }
});

module.exports = DriftView;
