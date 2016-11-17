"use strict";

require('./index.scss');

var Easing = Base.PrefabView.extend({
  template: '',

  ballTpl: _(require('./index.html')).template(),

  options: {
    duration: 1400,
    targetClass: '.js-bc-result-ball',
    values: [],
    range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    destroyOnStop: true
  },

  animatingStatus: [],
  animating: false,

  initialize: function() {
    this.$ballList = this.$(this.options.targetClass);

    // this.options.values = _(this.$ballList).map(function(el) {
    //   return _($(el).text()).trim();
    // });

    this.$ballList.css({
      position: 'relative',
      overflow: 'hidden'
    });

    _(this.$ballList).each(function(el) {
      $(el).html(this.ballTpl({
        range: this.options.range
      }));
    }, this);

    this.$innerBallList = this.$ballList.children();

    this.animatingStatus = _(this.$innerBallList.length).times(_.constant(false));

    this.options.height = this.$el.find('.js-ball-easing-item').height();
    this.options.halfTotalHeight = this.options.height * this.options.range.length;
    this.options.totalHeight = this.options.halfTotalHeight * 2;

    this.renderCurrentBall(this.getCurrentBallPosList(this.options.values));
  },

  getCurrentBallPosList: function(balls) {
    return _(balls).map(function(ball) {
      return -this.options.height * _(this.options.range).indexOf(ball);
    }, this);
  },

  renderCurrentBall: function(ballPosList) {
    _(this.$innerBallList).each(function(el, index) {
      $(el).css('top', ballPosList[index]);
    }, this);
  },

  startAnimation: function() {
    var self = this;

    if (this.animating) {
      return false;
    }

    this.animating = true;

    this.$innerBallList.each(function(index, el) {
      var $el = $(el);

      self.animatingStatus[index] = true;

      setTimeout(function() {
        self.roll($el, 1000, 'easeInQuad', function() {
          self.rollLoop($el, index, 'linear');
        });
      }, 1000 * index);
    });

    this.on('animation:stop:start', function(index) {
      self.stopRoll(index, 1000, function() {
        if (self.$innerBallList.length - 1 === index) {
          self.trigger('animation:stop');
        } else {

          self.animatingStatus[++index] = false;
          self.trigger('animation:stop:start', index);
        }
      });
    });
  },

  roll: function($el, duration, easing, perAnimationCallback) {
    $el.animate({
      top: -this.options.halfTotalHeight
    }, duration || this.options.duration, easing || 'linear', perAnimationCallback);
  },

  rollLoop: function($el, index, easing) {
    var self = this;
    $el.css('top', 0);
    if (this.animatingStatus[index]) {
      this.roll($el, this.options.duration, easing, function() {
        self.rollLoop($el, index, easing);
      });
    } else {
      if (index === 0) {
        this.trigger('animation:stop:start', 0);
      }
    }
  },

  stopRoll: function(index, duration, stopCallback) {
    var self = this;
    var $el = this.$innerBallList.eq(index);

    var ballPosList = this.getCurrentBallPosList(this.options.values);

    $el.stop(true, true).animate({
      top: ballPosList[index]
    }, duration || self.options.duration, 'easeOutQuad', function() {
      // $el.css('top', ballPosList[index]);
      stopCallback();
    });
  },

  stopAnimation: function(values) {
    if (!this.animating) {
      return false;
    }

    this.options.values = values;

    this.animatingStatus[0] = false;

    this.animating = false;
  },

  destroy: function() {
    this.unSubscribeFromAll(); // 移除view绑定的中介者。
    this.unbind(); // 移除当前view的所有事件监听。不是必须做，因为会被垃圾回收。
    this.$el.empty();
  }
});

module.exports = Easing;