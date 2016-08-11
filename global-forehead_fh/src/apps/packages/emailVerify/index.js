"use strict";

require('./../misc/common-init.js');

var EmailVerify = Base.ItemView.extend({

  template: require('./index.html'),

  initialize: function() {
   
  },
  onRender: function() {
  	this.getInfo().done(function(res) {
      if (res && res.result === 0) {
      	if (res.root.success) {
      		$('.js-1').removeClass('hidden');
      	}
      	else{
      		$('.js-2').removeClass('hidden');
      	}
      } else {
      	$('.js-2').removeClass('hidden');
      }
    });
  },
  getInfo: function() {

  	var sid = this.getUrlParam('sid');
  	var userName = this.getUrlParam('userName');

    return Global.sync.ajax({
      url: '/acct/usermsg/findPwd.json',
      data: {
        sid: sid,
        userName: userName
      }
    });
  },

  getUrlParam: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search;
    r = r.replace('amp;','').substr(1);
    r = r.match(reg);  //匹配目标参数
     
    if (r != null){
      return unescape(r[2]);
    }

    return null; //返回参数值
  }

});

$('.js-package').html(new EmailVerify().render().$el);
