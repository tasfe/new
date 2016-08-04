define(function(require, exports, module) {

  var PollingModule = Base.Module.extend({

    startWithParent: false,

    _interval: 1000,

    _polling: {},

    initialize: function(options, moduleName, app) {

    },

    start: function(pollingId, pollingFn) {
      if (!this._polling[pollingId]) {

        this._polling[pollingId] = pollingFn;

        pollingFn.call(this);
      }
    },

    stop: function(pollingId) {
      if (pollingId) {
        clearInterval(this._polling[pollingId]);
        delete this._polling[pollingId];
      } else {

        _.each(this._polling, function(fn, pollingId) {
          clearInterval(pollingId.timer);
        });

        this._polling = {};
      }
    },

    next: function(pollingId, options) {
      var self = this;

      options = options || {};

      if (pollingId) {
        setTimeout(function() {

          self._polling[pollingId] && self._polling[pollingId].call(self);

        }, options.interval || this._interval);
      }
    }

  });

  module.exports = PollingModule;

});