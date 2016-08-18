"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var BettingRecordView = require('bettingButler/views/index');


var bettingButlerController = RouterController.extend({


  bettingbutler: function() {
    this.changeMainReginView(new BettingRecordView(), {

    });
  }


});

module.exports = bettingButlerController;
