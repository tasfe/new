"use strict";

var InsideLetterView = require('skeleton/bases/insideLetter');

var InsideLetterModule = Base.Module.extend({

  startWithParent: false,

  onStart: function() {
    this.insideLetterView = new InsideLetterView();
    Global.insideLetterRegion.show(this.insideLetterView);
  },

  openChat: function(userId, username) {
    this.insideLetterView.openChat(userId, username);
  }
});

module.exports = InsideLetterModule;
