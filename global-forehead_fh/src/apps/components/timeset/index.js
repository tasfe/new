/**
 * 时间组view
 */

"use strict";

Base.Prefab.Timeset = Base.PrefabView.extend({
  template: require('./index.html'),

  className: 'input-group',

  options: {
    prevClass: 'js',
    size: 'input-smd',
    endDate: moment().add(1, 'days').startOf('day')
  },

  tagName: 'div',

  initialize: function() {

    _.defaults(this.options, {
      startTime: 'startTime',
      startTimeHolder: '起始时间',
      startDefaultDate: null,
      startOps: {},
      onStartTimeChange: this.onStartTimeChange,
      onStartTimeHide: _.noop,

      endTime: 'endTime',
      endTimeHolder: '结束时间',
      endDefaultDate: null,
      endOps: {},
      onEndTimeChange: this.onEndTimeChange,
      onEndTimeHide: _.noop
    });

    _.defaults(this.options.startOps, {
      format: 'YYYY-MM-DD H:mm:ss',
      useCurrent: false,
      maxDate: this.options.endDate.toDate()
    });

    _.defaults(this.options.endOps, {
      format: 'YYYY-MM-DD H:mm:ss',
      useCurrent: true,
      maxDate: this.options.endDate.toDate()
    });

    // _.defaults(this.options.startOps, {
    //   format: 'YYYY-MM-DD',
    //   useCurrent: false,
    //   maxDate: this.options.endDate.toDate()
    // });
    //
    // _.defaults(this.options.endOps, {
    //   format: 'YYYY-MM-DD',
    //   useCurrent: true,
    //   maxDate: this.options.endDate.toDate()
    // });

  },

  render: function(options) {
    options = options || this.options;

    this.$el.html(_(this.template).template()(_(options).pick(
      'prevClass',
      'startTime',
      'startTimeHolder',
      'endTimeHolder',
      'startDefaultDate',
      'endDefaultDate',
      'endTime',
      'size'
    )));

    this.$startDate = this.$('.' + options.prevClass + '-start-time');
    this.$endDate = this.$('.' + options.prevClass + '-end-time');

    this._initEvent(options);

    return this;
  },

  onStartTimeChange: function(ev) {
    var view = ev.data.view;
    var endDate = Date.parse(view.$endDate.data('DateTimePicker').date());
    if (endDate < Date.parse(ev.date)) {
      view.$endDate.data('DateTimePicker').date(ev.date);
    }
  },

  onEndTimeChange: function(ev) {
    var view = ev.data.view;
    var startDate = Date.parse(view.$startDate.data('DateTimePicker').date());
    if (startDate > Date.parse(ev.date)) {
      view.$startDate.data('DateTimePicker').date(ev.date);
    }
  },

  _initEvent: function(options) {
    this.$startDate.datetimepicker(options.startOps)
      .on('dp.change', {view: this}, options.onStartTimeChange);
      //.on('hide', {view: this}, options.onStartTimeHide);

    this.$endDate.datetimepicker(options.endOps)
      .on('dp.change', {view: this}, options.onEndTimeChange);
      //.on('hide', {view: this}, options.onEndTimeHide);

    return this;
  }
});

module.exports = Base.Prefab.Timeset;
