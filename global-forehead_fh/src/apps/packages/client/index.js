"use strict";

require('./jquery.mousewheel');
require('./effect');

var ClientView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize: function() {
    $('body').addClass('hidden');
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
      $('body').removeClass('hidden');
    });
  }
});

$('.js-package').html(new ClientView().render().$el);
