"use strict";

var StatisticView = require('./../statistic');

var levelConfig = require('./../levelConfig');

var SelfView = Base.ItemView.extend({

  template: require('./self.html'),

  startOnLoading: true,

  getInfo0Xhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/info0.json'
    });
  },

  getInfo1Xhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/info1.json'
    });
  },

  applyXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/get.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;
    var acctInfo = Global.memoryCache.get('acctInfo');
    this.userGroupLevel = acctInfo.userGroupLevel;

    if(this.userGroupLevel===1){
      this.getInfo0Xhr()
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res) {
          if (res && res.result === 0) {
            self._render(res.root);
          }
        });
    }else {
      this.getInfo1Xhr()
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res,res2) {
          if ((res && res.result) === 0|| (res2 && res2.result===0)) {
            self._render(res.root, res2.root);
          }
        });
    }



  },

  _render: function(info,info2) {
    var self = this;
    var config ;
    if(this.userGroupLevel===1){
      config = levelConfig.getByName('TOP');
    }else{
      config = levelConfig.getByName('LEVEL_ONE');
    }

    var statisticView = new StatisticView({
      level: config,
      dividList: info.dividList,
      signList: info.signList
    })
      .render().on('click:tab',function(e,data){

      })
      .on('click:op', function(e, data) {
        var $target = $(e.currentTarget);
        $target.button('loading');
        self.applyXhr({
          dividId: data.dividId,
          type: 0
        })
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('申请成功！<br />等待平台审核后会自动发放到您的平台账户。');
            }else{
              Global.ui.notification.show(res.msg)
            }
            self.refresh();
          });
      });
    this.$('.js-ac-statistic').html(statisticView.$el);


  },



});

module.exports = SelfView;
