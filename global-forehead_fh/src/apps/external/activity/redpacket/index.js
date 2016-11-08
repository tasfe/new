"use strict";

// var config = require('com/newrecharge/config');

var RedPacket = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
  },
  initialize: function() {
    var self = this;
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
      // window.setTimeout(function() {
      //   //self._onRender();
      // }, 10);
    });
	 // $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  _onRender: function() {
    //this.setAllSize();
  },
	onResize: function () {
		this.setAllSize();
	},
  setAllSize: function(){
    var wh = $(window).height();
	  var bgw = 1920 * (wh / 1000);

    this.$('.activity_mask').css({
    	'height' : wh,
	    'background-size' : bgw + 'px ' + wh + 'px'
    });
  },
	//handler event
});

module.exports = RedPacket;
