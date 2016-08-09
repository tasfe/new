require('./index.scss');

$.widget('gl.emailverify', {

  template: require('./index.html'),

  _create: function() {
    this.element.html(_(this.template).template()());
  }
});

$(document).ready(function() {
  $('.js-package').emailverify();
});
