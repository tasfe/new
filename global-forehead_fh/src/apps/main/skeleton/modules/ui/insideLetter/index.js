"use strict";

var InsideLetterView = require('skeleton/bases/insideLetter');

var InsideLetterModule = Base.Module.extend({

  startWithParent: false,

  onStart: function() {
    Global.insideLetterRegion.show(new InsideLetterView());
  }
});

module.exports = InsideLetterModule;
