"use strict";

require('./index.scss');

$.widget('gl.numRange', {

  template: require('./index.html'),

  options: {
    namespace: 'numRange',
    name: 'num',
    min: 1,
    // max: 100,
    onChange: _.noop,
    onOverMax: _.noop
  },

  _create: function() {
    this.element.addClass('js-wt-number num-range-center');

    // this.element.prepend($html);
    this.$parent = this.element.wrap($(this.template)).parent();
    this.$parent.find('.num-range-left').after(this.element);

    this.$number = this.element;
    this.$btnMinus = this.$parent.find('.js-wt-num-range-btn.num-range-left');
    this.$btnAdd = this.$parent.find('.js-wt-num-range-btn.num-range-right');

    this._bindEvents();
  },

  _bindEvents: function() {
    this._on(this.$parent, {
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
    this.options.onChange.call(this, Number(this.$number.val()));
  },

  //event handlers

  numberInputHandler: function(e) {
    this.numChange(Math.floor(this.$number.val()) || 0);

    this.options.onChange.call(this, Number(this.$number.val()));
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
      self.options.onChange.call(self, Number(self.$number.val()));
    });
  }
});

module.exports = $.gl.numRange;
