"use strict";

var NewHelpCenterController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new NewHelpCenterController(), {
    'nhc': 'newHelpCenter' // 概览

  });
};
