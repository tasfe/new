"use strict";

var RainActivity = require('com/rainActivity');

var RainActivityModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  raining: false,

  _skip: false,

  checkXhr: function() {
    return Global.sync.ajax({
      url: '/info/rainactivity/info.json',
      data: {
        activityId: 3
      }
    });
  },

  onStart: function() {
    var self = this;

    Global.polling.start('activity:rain', function() {
      self.check()
        .always(function() {
          Global.polling.next('activity:rain', {
            interval: self.interval
          });
        });
    });
  },

  check: function(options) {
    var self = this;
    return this.checkXhr()
      .done(function(res) {
        var data;
        if (self._skip) {
          return false;
        }
        if (res && res.result === 0) {
          self.data = data = res.root || {};
          // 0活动未开始，1活动进行中，2活动已结束 || !data.available
          if (data.status === 2 ) {
            return;
          }

          if (data.raining) {
            self.startRaining(data.duration);
          } else {
            self.countdownRaining(data.nextTime, data.duration);
          }
        }
      });
  },

  skip: function() {
    var self = this;
    this._skip = true;
    _.delay(function() {
      self._skip = false;
    }, self.data.duration * 1000);
  },

  countdownRaining: function(nextTime, duration) {
    var self = this;

    clearTimeout(this.countdownTimer);

    this.countdownTimer = _.delay(function() {
      self.startRaining(duration);
    }, nextTime * 1000);
  },

  startRaining: function(duration) {
    var self = this;
    var rainActivity;
    if (!this.raining) {
      rainActivity = new RainActivity({
        duration: duration
      })
        .render()
        .on('destroy', function() {
          self.raining = false;
        });
      this.raining = true;
      $('body').append(rainActivity.$el);
    }
  },

  onStop: function() {
    Global.polling.stop('activity:rain');
  }
});

module.exports = RainActivityModule;
