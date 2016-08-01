"use strict";


var ActiveCenterController = require('activeCenter/controller');

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new ActiveCenterController(), {
    'ab/1': 'activeCenter'
  });
};
