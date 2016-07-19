require('./index.scss');

$.widget('gl.noFound', {

  template: require('./index.html'),

  _create: function() {
    this.element.html(_(this.template).template()());
  }
});

$(document).ready(function() {
  $('.js-package').noFound().addClass('main-404-div');
});
