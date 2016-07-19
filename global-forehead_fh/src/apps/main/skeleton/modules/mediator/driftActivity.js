"use strict";

var DriftActivity = require('com/driftActivity');

var DriftActivityModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  opening: false,

  checkXhr: function() {
    return Global.sync.ajax({
      url: '/info/bottleactivity/info.json',
      data: {
        activityId: 12
      }
    });
  },

  onStart: function() {
    var self = this;
    var init = true;

    this.initDrift();

    Global.polling.start('activity:drift', function() {
      self.check({
        init: init
      })
        .always(function() {
          Global.polling.next('activity:drift', {
            interval: self.interval
          });
        });
      init = false;
    });
  },

  initDrift: function() {
    this.driftActivity = new DriftActivity();
    $('body').append(this.driftActivity.render().$el);
  },

  check: function(options) {
    var self = this;
    return this.checkXhr()
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          self.data = data = res.root || {};
          // 0活动未开始，1活动进行中，2活动已结束 || !data.available
          if (data.status !== 1) {
            self.driftActivity.hideBottle();
            return;
          }

          if (options.init) {
            self.driftActivity.showBottle();
          }

          if (data.opening) {
            self.startOpening(data.duration);
          } else {
            self.countdownOpening(data.nextTime, data.duration);
          }
        }
      });
  },

  getBonusLimit: function() {
    return _(this.data.bonusLimit).convert2yuan();
  },

  countdownOpening: function(nextTime, duration) {
    var self = this;

    clearTimeout(this.countdownTimer);

    this.countdownTimer = _.delay(function() {
      self.startOpening(duration);
    }, nextTime * 1000);
  },

  startOpening: function(duration) {
    var self = this;
    if (!this.opening) {
      this.driftActivity.showRiver(duration)
        .on('destroy:river', function() {
          self.opening = false;
        });
      this.opening = true;
    }
  },

  onStop: function() {
    this.driftActivity.destroy();
    Global.polling.stop('activity:drift');
  }
});

module.exports = DriftActivityModule;
