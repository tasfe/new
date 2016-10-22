 "use strict";

require('./index.scss');

//红包大派送活动视图
// var RedpacketActivityView = require('com/redpacketActivity');

var ActivityEntryView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    //点击红包活动事件
    'click .js-redpacket-btn': 'clickRedpacketActivityHandler'
  },

  onRender: function(){
    var self = this;
    this.checkEntryShow();
    //检查红包大放送状态
    this.checkRedPacketState();
    window.onhashchange = function () {
      self.checkEntryShow();
    }

    //检查红包大派送活动状态，是否显示入口
    // this.redpacketActivityView = new RedpacketActivityView();
    // this.redpacketActivityView.checkState(this.$('.js-redpacket-btn'));
  },

  //检查是否为博彩页面，不是隐藏活动入口
  checkEntryShow: function(){
    var strHash = document.location.hash;
    // console.log(strHash.slice(1,3));
    if (strHash.slice(1,3) == 'bc') {
      $('.activity-entry-container').removeClass('hidden');
    }else{
      $('.activity-entry-container').addClass('hidden');
    }
  },
  //检查是否在红包大放送活动时间内，不是则隐藏红包大放送活动入口
  checkRedPacketState: function(){
    var self = this;
    this.getRedpacketInfoXhr().done(function(res){
      // console.log(res);
      if(res && res.result == 0){
        var data = res.root;
        if(data.status!=0){
          self.$('.js-redpacket-btn').addClass('hidden');
        }
      }else{
        self.$('.js-redpacket-btn').addClass('hidden');
      }
    });
  },

  //Xhr's
  //获取红包大放送信息
  getRedpacketInfoXhr: function() {
    return Global.sync.ajax({
      url:'/info/moneytreeactivity/info.json',
      data:{
        activityId: 9
      }
    });
  },
  //领取红包大放送奖励
  getRedpacketAwardXhr: function(){
    return Global.sync.ajax({
      url:'/info/moneytreeactivity/doget.json',
      data:{
        activityId:9
      }
    });
  },

  //点击红包活动事件
  clickRedpacketActivityHandler: function(){
    var self = this;
    // if(this.redpacketActivityView && this.redpacketActivityView.isDestroyed){
    //   this.redpacketActivityView = new WinlossActivityView();
    // }
    // $('body').append(this.redpacketActivityView.$el);
    // this.redpacketActivityView.render();
    this.getRedpacketAwardXhr().done(function(res){
      if(res && res.result == 0){
        self.$('js-redpacket-btn').addClass('redpacket-btn-op');
        Global.ui.dialog.show({
          title:'领取成功',
          body:res.msg
        });
      }else{
        Global.ui.dialog.show({
          title:'领取失败',
          body:res.msg
        });
      }
    });
  }


});

module.exports = ActivityEntryView;
