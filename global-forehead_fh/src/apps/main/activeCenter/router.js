"use strict";

var ActiveCenterController = require('activeCenter/controller');

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new ActiveCenterController(), {
    'at/tb': 'activityCenter',
    'at/ag': 'agencyActivity',
    'at/ti': 'ticketActivity',
    'at/ol':'onlineGameActivity'
  });
};
