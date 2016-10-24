"use strict";

var NewView = require('./new');
var ModifyView = require('./modify');

var EmailBindingView = Base.ItemView.extend({

  template: '',

  onRender: function() {
    var self = this;

    this.subscribe('states', 'states:updating', function onceSubscribe(model) {
      var states = model.toJSON();
      var view;
      if (states.hasEmail) {
        view = new ModifyView({
          email: states.email
        }).render();
      } else {
        view = new NewView().render();
      }
      self.$el.html(view.el);
      self.unSubscribe('states', 'states:updating', onceSubscribe);
    });
  }
});

module.exports = EmailBindingView;
