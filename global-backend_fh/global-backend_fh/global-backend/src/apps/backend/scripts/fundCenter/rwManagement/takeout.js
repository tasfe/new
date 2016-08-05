define(function (require, exports, module) {

  var ListView = require('./list');

  var TakeoutView = ListView.extend({
    initialize: function() {
      _(this.options).extend({
        paymentType: 0
      });
    }
  });

  module.exports = TakeoutView;
});