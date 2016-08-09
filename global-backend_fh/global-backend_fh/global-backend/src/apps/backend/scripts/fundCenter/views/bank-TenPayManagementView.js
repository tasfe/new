define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-TenPayManagementView.html'),

    events: {},

    initialize: function () {
    }
  });

  module.exports = operateCheckView;
});