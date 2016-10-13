"use strict";

var InsideLetterView2 = require('skeleton/bases/insideLetter2');

var InsideLetterModule = Base.Module.extend({

  startWithParent: false,

  isBindQQ: 0,

  onStart: function() {
    var $target = $(e.currentTarget);

    if (this.isBindQQ == 0) {
      this.isBindQQ = 1;
      $target.parent().removeClass('letterList-close');
      var insideLetterView2 = new InsideLetterView2({
        el: $('.js-nc-insideLetter2'),
        reqData: {
          userId: '',
          name: ''
        }
      }).render();
      $('.js-single-lowLevelSelect').animate({height:"551px"});
    }
    else if (this.isBindQQ == 1) {
      this.isBindQQ = 2;
      $('.js-single-lowLevelSelect').animate({height:"0px"});
      $target.parent().addClass('letterList-close');

      $('.js-info-window').fadeOut("fast");
      $('.js-selected-container').fadeOut("fast");
    }
    else{
      this.isBindQQ = 1;
      $target.parent().removeClass('letterList-close');
      $('.js-single-lowLevelSelect').animate({height:"551px"});
    }
  }
});

module.exports = InsideLetterModule;
