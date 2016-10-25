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
					if(res && res.result === 0 && res.root != null){
							var money = res.root.dataList[0].result / 10000;
							if(money != 0){  // 因接口实现本身有小问题，所以奖励为 0 时是领取失败的。
									var msg = '恭喜您，您成功领取'+ money +'元！';
									Global.ui.dialog.show({
											title: '领取成功',
											body: msg
									});
							}else{
									Global.ui.dialog.show({
											title: '领取失败',
											body: '对不起，您未达到满足条件，充值金额大于等于100元。'
									});
							}
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
