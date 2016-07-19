"use strict";

var HelpCenterController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new HelpCenterController(), {
    'hc': 'helpCenter' // 概览
  });
};
