"use strict";



var ActiveCenterController = require('activeCenter/controller');


exports.install = function() {

  window.Global.appRouter.processAppRoutes(new ActiveCenterController(), {
    
    'aa/1': 'activeCenter'
  });

 

};
