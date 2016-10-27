"use strict";

require('./effect');

var DownloadView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize: function() {
    $('body').addClass('hidden');
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
      $('body').removeClass('hidden');
      $('.wm-loader-wrapper').addClass('hidden');
    });
  }
});

$('.js-package').html(new DownloadView().render().$el);
