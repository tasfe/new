"use strict";

require('./../misc/common.js');
require('./index.scss');

var activityId = _.getUrlParam('id') || 1;

Global.m.oauth.check({
  autoLogout: false
}).fail(function(xhr, resType, type) {
  if (resType === 'error') {
    if (type === 'Unauthorized') {
      Global.ui.notification.show('您还未登录,请登录账号！', {
        event: function () {
          window.location.href = 'login.html';
        }
      });
    }
  }
})
  .done(function() {
    switch (activityId) {
      case '9':
        require.ensure(['./redpacket'], function(require) {
          init(require('./redpacket'), activityId);
        }, 'redpacket');
        break;
      case '38':
        require.ensure(['./newrecharge'], function(require) {
          init(require('./newrecharge'), activityId);
        }, 'newrecharge');
        break;
      case '39':
        require.ensure(['./newuseract'], function(require) {
          init(require('./newuseract'), activityId);
        }, 'newuseract');
        break;
      case '40':
        require.ensure(['./happyPassThrough'], function(require) {
          init(require('./happyPassThrough'), activityId);
        }, 'happyPassThrough');
        break;
    }
  });

function init(CurrentView, activityId) {
  new CurrentView({
    el: '.js-package',
    activityId: activityId
  }).render();
}

