"use strict";

var RouterController = require('skeleton/controllers/router');

var NewHelpCenterView = require('newHelpCenter/index');

var NewHelpCenterController = RouterController.extend({

  newHelpCenter: function() {
    this.changeMainReginView(new NewHelpCenterView());
  },

});

module.exports = NewHelpCenterController;
