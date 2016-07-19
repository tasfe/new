$.widget('gl.statistics', {

  options: {
    type: 'text',
    targetEl: null,
    triggerEvent: 'input propertychange',
    max: 50,
    onChange: _.noop,
    filter: '',
    countFilter: ''
  },

  _create: function() {

    _.bindAll(this, 'changeHandler');

    this.element.html('<span class="js-wt-statistics-curt">0</span>/<span class="js-wt-statistics-max">' +
      this.options.max + '</span>');

    this.$targetEl = $(this.options.targetEl);

    this.$curtCount = this.element.find('.js-wt-statistics-curt');

    this._bindEvents();
  },

  _bindEvents: function() {
    var self = this;

    if (this.options.type === 'text') {
      $(this.options.targetEl).on(this.options.triggerEvent, this.changeHandler);
    } else if (this.options.type === 'dom') {
      $(this.options.targetEl).on(this.options.triggerEvent, this.options.filter, this.changeHandler);
    }
  },

  setMax: function(max) {
    this.options.max = max;
    this.element.find('.js-wt-statistics-max').text(this.options.max);
  },

  count: function() {
    if (this.options.type === 'text') {

      return this.$targetEl.val().length;
    } else if (this.options.type === 'dom') {

      return this.$targetEl.find(this.options.countFilter).length;
    }
  },

  reCount: function() {
    var count = this.count();

    this.$curtCount.text(count);
  },

  test: function() {

  },

  //event handlers

  changeHandler: function(e) {
    var count = this.count();
    var flag = count > this.options.max;
    if (flag)  {
      this.$curtCount.addClass('text-danger');
    } else {
      this.$curtCount.removeClass('text-danger');
    }

    this.$curtCount.text(count);

    this.options.onChange(this.count(), flag);
  }
});

module.exports = $.gl.statistics;
