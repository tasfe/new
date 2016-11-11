 "use strict";

require('./index.scss');

//红包大派送活动视图
// var RedpacketActivityView = require('com/redpacketActivity');

var ActivityEntryView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    //点击红包活动事件
    'click .js-redpacket-btn': 'clickRedpacketActivityHandler',
    'click .js-close-modal' : 'redPackeDefault',
    'click .js-shortcut-res-link' : 'redPackeDefault'
  },

  onRender: function(){
    var self = this;
    this.checkEntryShow();
    //检查红包大放送状态
    this.checkRedPacketState();
    this.updateRedPacketCount();
    this.$shortCutRes = this.$(".js-shortcut-res");
    this.$shortCutResFail = this.$(".js-shortcut-res-fail");
    this.$shortCutResSuccess = this.$(".js-shortcut-res-success");
    this.$shortCutResNum = this.$(".js-shortcut-res-num");
    this.$redpacketCount = this.$(".js-redpacket-count");
    this.$redpacketBtn = this.$(".js-redpacket-btn");
    this.canClick = true;
    window.onhashchange = function () {
      self.checkEntryShow();
      self.updateRedPacketCount();
    }
    setInterval(function(){
      self.updateRedPacketCount();
    },30000);
    //检查红包大派送活动状态，是否显示入口
    // this.redpacketActivityView = new RedpacketActivityView();
    // this.redpacketActivityView.checkState(this.$('.js-redpacket-btn'));
  },

  //检查是否为博彩页面，不是隐藏活动入口
  checkEntryShow: function(){
    var strHash = document.location.hash;
    if (strHash.slice(1,3) == 'bc') {
      $(".activity-entry-container").removeClass('hidden');
    }else{
      $(".activity-entry-container").addClass('hidden');
    }
  },

  //检查是否在红包大放送活动时间内，不是则隐藏红包大放送活动入口
  checkRedPacketState: function(){
    var self = this;
    this.getRedpacketInfoXhr().done(function(res){
      if(res && res.result === 0){
        var data = res.root;
        if(data.status != 1){
          self.$('.js-redpacket-btn').addClass('hidden');
        }
      }else{
        self.$('.js-redpacket-btn').addClass('hidden');
      }
    });
  },
  //更新可抽红包数量
  updateRedPacketCount: function(){
    var self = this;
    this.getRedpacketCountXhr().done(function(res){
      if(res && res.result === 0){
        var data = res.root;
        var num = data.totalTimes - data.useTimes < 0 ? 0 : data.totalTimes - data.useTimes;
        self.$redpacketCount.html(num);
      }
    })
  },

  //Xhr's
  //获取红包大放送信息
  getRedpacketInfoXhr: function() {
    return Global.sync.ajax({
      url:'/info/moneytreeactivity/info.json',
      data:{
        activityId:9
      }
    });
  },
  //获得可抽奖次数
  getRedpacketCountXhr: function(){
    return Global.sync.ajax({
      url:'/info/moneytreeactivity/info1.json',
      data:{
        activityId:9
      }
    })
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
    if(this.canClick){
      this.canClick = false;
      // if(this.redpacketActivityView && this.redpacketActivityView.isDestroyed){
      //   this.redpacketActivityView = new WinlossActivityView();
      // }
      // $('body').append(this.redpacketActivityView.$el);
      // this.redpacketActivityView.render();
      this.getRedpacketAwardXhr().done(function(res){
        if(res && res.result == 0 && res.root != null){
          self.$redpacketBtn.addClass('redpacket-btn-op');
          self.updateRedPacketCount();
          var money = res.root[0].result / 10000;

          self.$shortCutRes.addClass("shortcut-res-top");
          self.$shortCutResSuccess.removeClass("hidden");
          self.$shortCutResNum.html(money);
          self.$shortCutRes.removeClass("hidden");

        }else{
          if(res.msg === '您已经领过福利了哦，明天再来吧！'){
            Global.ui.notification.show(res.msg);
          }else{
            self.$shortCutRes.removeClass("hidden");
            self.$shortCutResFail.removeClass("hidden");
          }
        }

      })
          .always(function () {
            self.timerT = setTimeout(function () {
              self.redPackeDefault();
            },5000)
          });
    }

  },

  //红包恢复默认状态，隐藏结果框
  redPackeDefault: function () {
    this.canClick = true;
    clearTimeout(this.timerT);
    this.$shortCutRes.addClass("hidden");
    this.$shortCutResSuccess.addClass("hidden");
    this.$shortCutResFail.addClass("hidden");
    this.$shortCutRes.removeClass("shortcut-res-top");
    this.$redpacketBtn.removeClass('redpacket-btn-op');
  }



});

module.exports = ActivityEntryView;
