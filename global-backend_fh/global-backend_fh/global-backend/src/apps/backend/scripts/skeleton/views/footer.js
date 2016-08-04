define(function(require, exports, module) {

  var FooterView = Base.ItemView.extend({

    template: require('text!skeleton/templates/footer.html')

  });

  module.exports = FooterView;

});