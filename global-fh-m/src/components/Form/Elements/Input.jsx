import React, {Component, PropTypes} from 'react'
import 'lib/js/datetimepicker.js'

class Input extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
  }

  componentDidMount () {
    $('input.datetime-input').datetimepicker({
      lang:'ch'
    });

    $('input.date-input').datetimepicker({
      lang:'ch',
      timepicker: false,
      format:'Y-m-d',
      formatDate:'Y-m-d',
    });

    $('input.date-input-start').datetimepicker({
      lang:'ch',
      timepicker: false,
      format:'Y-m-d',
      formatDate:'Y-m-d',
      onSelectDate : function(selectedDate, currentInput) {
        var option = currentInput.hasClass('date-input-start') ? "minDate" : "maxDate";
        var instance = new Date((selectedDate).getTime()).dateFormat('Y-m-d');
        var date = option === 'minDate'? {minDate: instance} : {maxDate: instance};
        $("input.date-input-end").datetimepicker(date);
        return false;
      }
    });

    $('input.date-input-end').datetimepicker({
      lang:'ch',
      timepicker: false,
      format:'Y-m-d',
      formatDate:'Y-m-d',
      onSelectDate : function(selectedDate, currentInput) {
        var option = currentInput.hasClass('date-input-start') ? "minDate" : "maxDate";
        var instance = new Date((selectedDate).getTime()).dateFormat('Y-m-d');
        var date = option === 'minDate'? {minDate: instance} : {maxDate: instance};
        $("input.date-input-start").datetimepicker(date);
        return false;
      }
    });

    //var dates = $("input.date-input-start, input.date-input-end").datepicker({
    //  numberOfMonths : 1,
    //  dateFormat : "yy-mm-dd",
    //  monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
    //  onSelect : function(selectedDate) {
    //    var option = this.className == "date-input-start hasDatepicker" ? "minDate" : "maxDate",
    //        instance = $(this).data("datepicker"),
    //        date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
    //    dates.not(this).datepicker("option", option, date);
    //  }
    //});

    $("input.datetime-input-start").datetimepicker({
      lang:'ch',
      onSelectDate : function(selectedDate, currentInput) {
        var option = currentInput.hasClass('datetime-input-start') ? "minDate" : "maxDate";
        var instance = new Date((selectedDate).getTime()).dateFormat('Y-m-d');
        var date = option === 'minDate'? {minDate: instance} : {maxDate: instance};
        $("input.datetime-input-end").datetimepicker(date);
        return false;
      }});

    $("input.datetime-input-end").datetimepicker({
      lang:'ch',
      onSelectDate : function(selectedDate, currentInput) {
        var option = currentInput.hasClass('datetime-input-start') ? "minDate" : "maxDate";
        var instance = new Date((selectedDate).getTime()).dateFormat('Y-m-d');
        var date = option === 'minDate'? {minDate: instance} : {maxDate: instance};
        $("input.datetime-input-start").datetimepicker(date);
        return false;
      }});
  }

  render() {
    let { config } = this.props

    return (
      <label className="iForm-list-inner">
        <span className="label">{config.text}</span>
        {config.addon && config.addon.after && <span className="iForm-inner-span">&nbsp;{config.addon.after}</span>}
        
        <input
          type={config.type || 'text'}
          name={config.name || ''}
          defaultValue={config.defaultValue === undefined ? '':config.defaultValue}
          placeholder={config.placeHolder || ''}
          readOnly={config.readonly}
          className={config.class || ''}
        />
        {config.addon && config.addon.before && <span className="iForm-inner-span">{config.addon.before}</span>}
      </label>
    )
  }
}

export default Input