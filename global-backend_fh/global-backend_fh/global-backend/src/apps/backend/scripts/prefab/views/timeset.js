/**
 * 时间组view
 */

define(function(require, exports, module) {

  var template = require('text!prefab/templates/timeset.html');

  Base.Prefab.Timeset = Base.PrefabView.extend({
    template: template,

    className: 'input-group',

    options: {
      prevClass: 'js',
      startDate:  moment().add(-36500, 'days'),
      endDate: moment().add(1, 'days'),
      startValidate: '',
      endValidate: '',
      strDefaultValue:'',
      endDefaultValue:'',
      startFormat: 'YYYY-MM-DD H:mm:ss',
      endFormat: 'YYYY-MM-DD H:mm:ss',
      showToday: false,
      widthHolder:''
    },

    tagName: 'div',

    initialize: function() {

      _.defaults(this.options, {
        startTime: 'startTime',
        startTimeHolder: '',
        startOps: {},
        onStartTimeChange: this.onStartTimeChange,
        onStartTimeHide: _.noop,

        endTime: 'endTime',
        endTimeHolder: '',
        endOps: {},
        onEndTimeChange: this.onEndTimeChange,
        onEndTimeHide: _.noop
      });

      _.defaults(this.options.startOps, {
        format: this.options.startFormat,
        useCurrent: false,
        minDate: this.options.startDate.toDate(),
        maxDate: this.options.endDate.toDate()
      });

      _.defaults(this.options.endOps, {
        format: this.options.endFormat,
        useCurrent: false,
        minDate: this.options.startDate.toDate(),
        maxDate: this.options.endDate.toDate()
      });
    },

    render: function(options) {
      options = options || this.options;
      if(options.showToday){
        //如果设置为显示当天时间范围，则起始日期为当天0时0分0秒至丹田23时59分59秒。如果输入格式限制为年月日，则起始日期为当天，结束日期为当天(第二天)
        var now = moment();
        options.strDefaultValue = now.format('YYYY-MM-DD');
        if(options.startFormat != 'YYYY-MM-DD'){
          options.strDefaultValue = options.strDefaultValue +' 0:00:00';
        }
        if(options.startFormat != 'YYYY-MM-DD'){
          options.endDefaultValue = now.format('YYYY-MM-DD') +' 23:59:59';
        }else{
          options.endDefaultValue = now.add(0,'days').format('YYYY-MM-DD');
        }
      }

      this.$el.html(_(this.template).template()(_(options).pick(
        'prevClass',
        'startTime',
        'startTimeHolder',
        'endTimeHolder',
        'endTime',
        'startValidate',
        'endValidate',
        'strDefaultValue',
        'endDefaultValue',
          'widthHolder'
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
});