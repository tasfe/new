"use strict";

var publicView = Base.ItemView.extend({

  template: require('userCenter/templates/publicView.html'),

  events: {

  },

  initialize: function() {
  },

  onRender: function() {
    var self = this;
    
  },

  checkState: function(){
    var self = this;
    $('#main').prepend(self.render().$el);

    function add0(m){return m<10?'0'+m:m }
    function formatTime(shijianchuo)
    {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }

    var acctInfo = Global.memoryCache.get('acctInfo');

    $('.uc-info dt').html('HI,' + acctInfo.username + ' 下午好!!!!! ');
    $('.uc-info dd').eq(0).html('上次登录时间：' + formatTime(acctInfo.lastLoginTime) );
    $('.uc-info dd').eq(1).html('上次登录地点：' + acctInfo.loginIp + ' ' + acctInfo.loginAdd);
    $('.uc-info div span').html('您当前VIP等级：VIP' + acctInfo.memberLevel + '级');
    $('.uc-info div b').html('VIP' + acctInfo.memberLevel);
  }
});

module.exports = publicView;
