define(function(require, exports, module) {

  var InputMonitorModule = Base.Module.extend({

    startWithParent: false,

    initialize: function() {
      var self = this;
      $(document).on('keyup', '.js-gl-monitor', function(e) {
        var $target = $(e.currentTarget);
        var type = $target.data('monitor-type');

        switch(type) {
          case 'number':
            self.validateNumber(e, $target);
            break;
        }
      });
      $(document).on('focus', '.js-gl-monitor', function(e) {
        var $target = $(e.currentTarget);
        $target.data('gl.monitor.val', $target.val());
      });

      $(document).on('blur', '.js-gl-monitor', function(e) {
        var $target = $(e.currentTarget);
        if ($target.data('gl.monitor.change')) {
          $target.trigger('change');
        }

      });
    },

    validateNumber: function(e, $target) {
      var range = $target.data('monitor-range');

      if (!range) {
        return true;
      }

      var currentVal = $target.val();
      var min = range[0];
      var max = range[1];
      var test = true;
      var val = currentVal;


      if (!/^\d+$/.test(currentVal)) {
        val = Number(currentVal.replace(/[^\d+]/g, ''));
        test = false;
      }

      if (val < min) {
        test = false;
        val = min;
      }
      if (val > max) {
        test = false;
        val = max;
      }

      $target.val(val);

      if ($target.data('gl.monitor.val') != $target.val()) {
        if (val < min || val > max || (val == min || val == max) && !test) {
          $target.data('gl.monitor.change', true);
        } else {
          $target.data('gl.monitor.change', false);
        }
      } else {
        $target.data('gl.monitor.change', false);
      }
    }

  });

  module.exports = InputMonitorModule;
});
