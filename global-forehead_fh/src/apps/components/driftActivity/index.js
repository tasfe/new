"use strict";

require('./index.scss');

var config = require('./config');

var DriftActivity = Base.ItemView.extend({

  template: require('./index.html'),

  riverTpl: _(require('./river.html')).template(),

  className: 'drift-activity',

  events: {
    'click .js-com-throw': 'driftHandler',
    'click. .js-com-bottle-close': 'bottleCloseHandler',
    'click .js-com-modal-close': 'modalCloseHandler',
    'keypress .js-com-bottle-money': 'moneyCheckHandler',
    'submit .js-com-throw-form': 'throwConfirmHandler',
    'click .js-com-pick-bottle': 'pickupHandler',
    'click .js-com-shut-bottle': 'shutBottleHandler'
  },

  serializeData: function() {
    return {
      types: config.getAll(),
      greetings: config.getAllGreetings()
    };
  },

  throwXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/bottleactivity/giveoutbottle.json',
      data: _(data).extend({
        activityId: 12
      })
    });
  },

  pickupXhr: function() {
    return Global.sync.ajax({
      url: '/info/bottleactivity/pickupbottle.json',
      data: {
        activityId: 12
      }
    });
  },

  onRender: function() {
    this.$mask = this.$('.js-com-mask');

    this.$bottle = this.$('.js-com-bottle');

    this.$popDescription = this.$('.js-com-pop-description');
    this.$popThrow = this.$(".pop_throw");
    this.$popThrowed = this.$(".pop_throwing");
    this.$popThrowFalse = this.$(".pop_throw_false");
    this.$popStatus = this.$('.pop_status');
    this.$popShut = this.$('.pop_shut');

    this.$popDescriptionText = this.$(".pop_description_text");

    this.$throwBtn = this.$('.js-com-throw-btn');
    this.$getPrize = this.$('.js-com-get-prize');
    this.$moneypwd = this.$('.js-com-money-pwd');

    this.$river = this.$('.js-com-river');

    this.$form = this.$('.js-com-throw-form');
    this.$form.parsley();
  },

  //common APIs

  showBottle: function() {
    this.$bottle.removeClass('hidden');
  },

  hideBottle: function() {
    this.$bottle.addClass('hidden');
  },

  removeBottle: function() {
    this.showMask();
    this.$popShut.css({
      left: ($(window).innerWidth() - this.$popShut.width()) / 2,
      top: ($(window).innerHeight() - this.$popShut.height()) / 2
    }).removeClass('hidden');
  },

  showRiver: function(duration) {
    var self = this;

    this.showBottle();

    this.$river.html(this.riverTpl());

    this.$('.river_bg').animate({
      bottom: 0
    }, 1000);

    window.setTimeout(function() {
      self.hideRiver();
    }, duration * 1000);

    return this;
  },

  hideRiver: function() {
    var self = this;
    this.$('.river_bg').animate({
      bottom: -250
    }, 1000, function() {
      self.$river.empty();
      self.trigger('destroy:river');
    });
  },

  showMask: function() {
    this.$mask.removeClass('hidden');
  },

  hideMask: function() {
    this.$mask.addClass('hidden');
  },

  modalClose: function($target) {
    $target.closest('.js-com-bottle-modal').addClass('hidden');

    this.$popDescription.removeClass('blue');

    this.hideMask();
    if ($target.data('checkFinished')) {
      this.checkFinished();
    }
  },

  showThrowed: function() {
    this.showMask();
    this.$popThrowed.css({
      left: ($(window).innerWidth() - this.$popThrowed.width()) / 2,
      top: ($(window).innerHeight() - this.$popThrowed.height()) / 2
    });
    this.$popThrowed.removeClass('hidden');
  },

  showThrowFalse: function() {
    this.showMask();
    this.$popThrowFalse.css({
      left: ($(window).innerWidth() - this.$popThrowFalse.width()) / 2,
      top: ($(window).innerHeight() - this.$popThrowFalse.height()) / 2
    });

    this.$popThrowFalse.removeClass('hidden');
  },

  showGetType: function(ops) {
    var text;
    this.$popStatus.children("div").attr("class", "");

    if (ops.type < 6) {
      this.$getPrize.addClass('hidden');
      this.$throwBtn.removeClass('hidden');

      this.$popStatus.children("div").addClass('pop_status_pic_0' + ops.type);

      if (ops.userType === 1) {
        text = '繁华世界在线娱乐赠您';
        text += '“'+ config.getById(ops.type).name +'”字漂流瓶' +
          '<br>' + config.getGreetingById(ops.greeting).title + '<br><br>';
      } else {
        text = '恭喜您捡到由' + ops.username;
        text += '扔的“'+ config.getById(ops.type).name +'”字漂流瓶，TA送给您的祝福是：' +
          '<br>' + config.getGreetingById(ops.greeting).title + '<br><br>';
      }

      this.$popDescription.toggleClass('blue', ops.userType === 1);


      if (ops.money > 0) {
        text += 'TA在漂流瓶里给您塞了' + _(ops.money).convert2yuan() + '元，已打入你的账户！';
      } else {
        text += '瓶子里一个子儿也没有！';
      }
    } else {
      this.$getPrize.removeClass('hidden');
      this.$throwBtn.addClass('hidden');

      this.$popStatus.children("div").addClass('pop_status_pic_06');
      text = '恭喜您集齐五福字贴，神仙佬爷们召唤成功<br>从此以后，您就是贵人附体了。<br><br>' +
        '注：领取该奖励需当天在平台消费满' + Global.m.driftActivity.getBonusLimit() + '元。';
    }

    this.$popDescriptionText.html(text);

    this.$popDescription.css({
      "left": ($(window).innerWidth() - this.$popDescription.width()) / 2,
      "top": ($(window).innerHeight() - this.$popDescription.height()) / 2
    }).removeClass('hidden');
    this.showMask();
  },

  checkFinished: function() {
    if (this.finished) {
      this.showGetType({
        type: 6
      });
      this.finished = false;
    }
  },

  //event handlers

  driftHandler: function(e) {
    var $target = $(e.currentTarget);

    if (!$target.hasClass('js-com-bottle')) {
      this.modalClose($target);
    }

    this.showMask();

    this.$popThrow.css({
      left: ($(window).innerWidth() - this.$popThrow.width()) / 2,
      top: ($(window).innerHeight() - this.$popThrow.height()) / 2
    }).removeClass('hidden');

  },

  bottleCloseHandler: function(e) {
    this.removeBottle();

    return false;
  },

  modalCloseHandler: function(e) {
    var $target = $(e.currentTarget);

    this.$moneypwd.prop('required', false);

    this.modalClose($target);
  },

  moneyCheckHandler: function(e) {
    var $target = $(e.currentTarget);

    this.$moneypwd.prop('required', $target.val().trim());
  },

  throwConfirmHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $submit = $target.find('[type=submit]');

    $submit.button('loading');
    this.throwXhr(_($target.serializeArray()).serializeObject())
      .always(function() {
        $submit.button('reset');
      })
      .done(function(res) {
        var data;

        Global.m.oauth.check();

        if (res && res.result === 0) {
          data = res.root || {};
          self.finished = data.status === 1;
          if (data.result === 0) {
            $target[0].reset();
            self.modalClose($target);
            self.showThrowed();
          } else if (data.result === 1) {
            $target[0].reset();
            self.modalClose($target);
            self.showThrowFalse();
          } else if (data.result === 2) {
            Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re">充值</a>。');
          } else if (data.result === 3) {
            Global.ui.notification.show('资金密码不正确。');
          } else if (data.result === 4) {
            Global.ui.notification.show('不在有效活动时间内。');
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  },

  pickupHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    $target.remove();

    this.pickupXhr()
      .done(function(res) {
        var data;
        var msg = res.msg;
        if (res && res.result === 0) {
          data = res.root[0] || {};
          self.finished = data.status === 1;

          Global.m.oauth.check();
          
          self.showGetType({
            type: data.bottletype,
            username: data.username,
            userType: data.usertype,
            greeting: data.words,
            money: data.bottlemoney
        });
        } else {
          Global.ui.notification.show(msg);
        }
      });
  },

  shutBottleHandler: function() {
    this.hideRiver();
    this.hideBottle();
    this.hideMask();
    this.$popShut.addClass('hidden');

    //Global.m.driftActivity.stop();
  }
});

module.exports = DriftActivity;
