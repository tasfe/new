"use strict";

var RouterController = require('skeleton/controllers/router');

var HelpCenterView = require('helpCenter/index');

var HelpCenterController = RouterController.extend({

  helpCenter: function() {
    this.changeMainReginView(new HelpCenterView());
  }
});

module.exports = HelpCenterController;
