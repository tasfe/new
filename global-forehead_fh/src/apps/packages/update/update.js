require('./../misc/common-init.js');
require('./update.scss');

$.widget('gl.update', {

  template: require('./update.html'),

  _create: function () {
    this.element.html(_(this.template).template()());

  }


});

$(document).ready(function() {
  $('.js-package').update();
});
