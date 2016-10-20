"use strict";

// var config = require('com/newrecharge/config');

var NewrechargeView = Base.ItemView.extend({

  template: require('./index.html'),

  btnTop:935/1024,

  events: {
    'click .js-accept-btn': 'getPrizeHandler'
  },
  initialize: function() {
    var self = this;
    require.ensure(['./index.scss'], function(require) {
      require('./index.scss');
      window.setTimeout(function() {
        self._onRender();
      }, 10);
    });
	  $(window).on('resize.resizeview', this.onResize.bind(this));
  },
  _onRender: function() {
    this.setAllSize();
  },
	onResize: function () {
		this.setAllSize();
	},
  setAllSize: function(){
    var wh = $(window).height();
	  var bgw = 1920 * (wh / 1024);
	  var btnw = 280 * (wh / 1024);
	  var btnh = 66 * (wh / 1024);

    this.$('.newrecharge_mask').css({
    	'height' : wh,
	    'background-size' : bgw + 'px ' + wh + 'px'
    });
    this.$('.js-accept-btn').css({
      'margin-top' : wh * this.btnTop + 'px',
	    'width' : btnw + 'px',
	    'height' : btnh + 'px'
    });
  },
	checkState: function(){
  	this.getInfoXhr().done(function (res) {
  		var flag = false;
		  if(res && res.result == 0){
				flag = true;
		  }else{
		  	flag = false;
		  }
		  if(!flag){
		  	this.remove();
		  }
	  });
	},
	//getXhr
	getInfoXhr: function() {
		return Global.sync.ajax({
			url: '/info/newrechact/info.json',
			data: {
				activityId: this.options.activityId
			}
		});
	},
	getPrizeXhr: function(){
		return Global.sync.ajax({
			url: '/info/newrechact/doget.json',
			data: {
				activityId: this.options.activityId
			}
		});
	},


	//handler event
	getPrizeHandler: function(){
		this.getPrizeXhr().done(function (res) {
			if(res && res.result == 0){
				Global.ui.dialog.show({
					title: '领取成功',
					body: res.msg
				});
			}else{
				Global.ui.dialog.show({
					title: '领取失败',
					body: res.msg
				});
			}
		});
	},
});

module.exports = NewrechargeView;
