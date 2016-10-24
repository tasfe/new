"use strict";

require('./index.scss');

var Countdown = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'countdown',

  options: {
    labels: ['hours', 'minutes', 'seconds'],
    format: '%H:%M:%S',
    type: 'label',
    color: '',
    countdownAnimation: false,
    animationTime: 10,
    animationClass: 'twinkling text-hot',
    prevClass: 'js-pf'
  },

  initialize: function() {
    this.tpl = _(this.template).template();
    this.options.color = this.options.color ? (this.options.color + '-') : '';
  },

  render: function(leftTime) {
    leftTime = (leftTime + _.now()) || _.now();
    if (_.isUndefined(this.$el.data('countdownInstance'))) {
      this._initCountdown(leftTime);
    } else {
      this.$el.countdown(leftTime);
    }
    return this;
  },

  bind: function(name, callback) {
    this.$el.on(name, callback);
    return this;
  },

  _initCountdown: function(leftTime) {
    var self = this;

    var currDate = _(self.options.labels).map(function() {
      return '00';
    }).join(':');

    var nextDate = currDate;
    var parser = /([0-9]{2})/gi;

    // Parse countdown string to an object
    function strfobj(str) {
      var parsed = str.match(parser),
        obj = {};
      _(self.options.labels).each(function(label, i) {
        obj[label] = parsed[i];
      });
      return obj;
    }

    // Return the time components that diffs
    function diff(obj1, obj2) {
      var _diff = [];
      _(self.options.labels).each(function(key) {
        if (obj1[key] !== obj2[key]) {
          _diff.push(key);
        }
      });
      return _diff;
    }

    // Build the layout
    var initData = strfobj(currDate);

    if (this.options.type === 'label') {
      _(self.options.labels).each(function(label, i) {
        self.$el.append(self.tpl({
          curr: _(initData[label].split('')).map(function(item) {
            return item;
          }),
          label: label,
          isLast: self.options.labels.length - 1 === i,
          color: self.options.color
        }));
      });
    }

    // Starts the countdown
    this.$el.countdown(leftTime, function(event) {
      var newDate = event.strftime(self.options.format);
      var seconds = Number(event.strftime('%S'));

      if (self.options.type === 'label') {
        var data;

        if (newDate !== nextDate) {
          currDate = nextDate;
          nextDate = newDate;
          // Setup the data
          data = {
            curr: strfobj(currDate),
            next: strfobj(nextDate)
          };

          // Apply the new values to each node that changed
          _(diff(data.curr, data.next)).each(function(label) {
            var selector = '.%s'.replace(/%s/, label);
            var $node = self.$el.find(selector);
            var nums = data.next[label].split('');

            var firstNum;
            var secondNum;

            if (self.options.countdownAnimation && label === 'seconds' && self.options.animationTime >= seconds) {
              firstNum = '<span class="countdown-num">'+ nums[0] +'</span>';
              secondNum = '<span class="countdown-num ' + self.options.animationClass + '">'+ nums[1] +'</span>';
            } else {
              firstNum = '<span>'+ nums[0] +'</span>';
              secondNum = '<span>'+ nums[1] +'</span>';
            }

            $node.html([firstNum, secondNum].join(''));
          });

          self.trigger('change:leftTime', event);
        }
      } else {
        self.$el.text(newDate);
      }
      })
      .on('finish.countdown', function(options) {
        self.trigger('finish.countdown', options);
      });
  }
});

module.exports = Countdown;
