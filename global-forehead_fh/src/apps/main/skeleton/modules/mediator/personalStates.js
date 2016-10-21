"use strict";

var PersonalStatesModel = require('skeleton/models/personalStates');

var PersonalMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 600000,

  initialize: function() {
    _.bindAll(this, 'fetch');
    this.model = Global.data.set('statesModel', new PersonalStatesModel());
  },

  onStart: function() {
    var self = this;

    Global.polling.start('states:request', function() {
      self.fetch()
        .always(function() {
          Global.polling.next('states:request', {
            interval: self.interval
          });
        });
    });
  },

  fetch: function() {
    var self = this;

    return this.model.fetch()
      .done(function() {
        Global.m.publish('states:updating', self.model);
      });
  },

  check: function() {
    var self = this;
    var events = _.extend({}, Backbone.Events);
    _.defer(function() {
      self.subscribe('states', 'states:updating', function onceSubscribe(model) {

        events.trigger('check:complete', model);

        self.unSubscribe('states', 'states:updating', onceSubscribe);
      });
    });

    return events;
  },

  onStop: function() {
    Global.polling.stop('states:request');
  }
});

module.exports = PersonalMediatorModule;
