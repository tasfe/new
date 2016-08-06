"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var ActiveCenterView = require('activeCenter/views/activeCenter');


var ActiveCenterController = RouterController.extend({
  activeCenter: function() {
    this.changeMainReginView(new ActiveCenterView(), {
        
    });
  }
});

module.exports = ActiveCenterController;
