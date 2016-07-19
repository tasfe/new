"use strict";

require('./misc/index.scss');

var ActiveCenterController = require('activeCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new ActiveCenterController(), {
    'aa': 'activeCenter'
  });

};
