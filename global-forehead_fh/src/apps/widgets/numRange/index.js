"use strict";

require('./index.scss');

$.widget('gl.numRange', {

  template: require('./index.html'),

  options: {
    namespace: 'numRange',
    name: 'num',
    defaultValue: 1,
    min: 1,
    max: 100,
    onChange: _.noop,
    onOverMax: _.noop
  },

  _create: function() {
    this.element.html(_(this.template).template()(_(this.options).pick('defaultValue', 'name')));

    this.$number = this.element.find('.js-wt-number');
    this.$btnMinus = this.element.find('.js-wt-num-range-btn.num-range-left');
    this.$btnAdd = this.element.find('.js-wt-num-range-btn.num-range-right');

    this._bindEvents();
  },

  _bindEvents: function() {
    this._on({
      'blur .js-wt-number': 'numberInputHandler',
      'mousedown .js-wt-num-range-btn': 'btnDownHandler'
    });
  },

  btnChange: function($target) {
    var type = $target.data('type');
    var currentNumber = Number(this.$number.val());

    this.numChange(type === 'minus' ? currentNumber - 1 : currentNumber + 1);
  },

  numChange: function(currentNumber) {
    this.$btnMinus.removeClass('disabled');
    this.$btnAdd.removeClass('disabled');

    if (currentNumber <= this.options.min) {
      currentNumber = this.options.min;
      this.$btnMinus.addClass('disabled');
    } else if (currentNumber > this.options.max) {
      currentNumber = this.options.max;
      this.$btnAdd.addClass('disabled');
      this.options.onOverMax(currentNumber);
    }

    this.$number.val(currentNumber);
  },

  //common APIs

  setRange: function(min, max) {
    min = Number(min) || 0;
    max = Number(max) || 0;

    if (min > max) {
      min = max;
    }

    this.options.min = min;
    this.options.max = max;

    this.numChange(Number(this.$number.val()) || 0);
    this.options.onChange(Number(this.$number.val()));
  },

  //event handlers

  numberInputHandler: function(e) {
    this.numChange(Math.floor(this.$number.val()) || 0);

    this.options.onChange(Number(this.$number.val()));
  },

  btnDownHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var timer;

    this.btnChange($target);

    var timeout = _.delay(function() {
      timer = setInterval(function() {
        self.btnChange($target);
      }, 50);
    }, 300);

    $(document).on('mouseup', function() {
      clearTimeout(timeout);
      clearInterval(timer);
      self.options.onChange(self.$number.val());
    });
  }
});

module.exports = $.gl.numRange;
