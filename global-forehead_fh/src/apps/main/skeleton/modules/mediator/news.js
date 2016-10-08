"use strict";

var NewsModel = require('skeleton/models/news');

var NewsMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  initialize: function() {
    _.bindAll(this, 'fetchNews');
    this.model = Global.data.set('newsModel', new NewsModel());
  },

  onStart: function() {
    var self = this;

    Global.polling.start('news:request', function() {
      self.fetchNews()
        .always(function () {
          Global.polling.next('news:request', {
            interval: self.interval
          });
        });
    });
  },

  fetchNews: function() {
    var self = this;

    var letterXhr = Global.sync.ajax({
      url: '/acct/usernotice/getletterlist.json',
      abort: false
    });
    var noticeXhr = Global.sync.ajax({
      url: '/acct/usernotice/getnoticelist.json',
      abort: false
    });

    return $.when(letterXhr, noticeXhr)
      .done(function (letterResData, noticeResData) {
        var letterRes = letterResData[0];
        var noticeRes = noticeResData[0];

        self.model.set({
          //letterList: letterRes.root.letterList,
          unReadLetter: letterRes.root.unReadLetter,
          //noticeList: noticeRes.root.noticeList,
          unReadNotice:noticeRes.root.unReadNotice
        }, {
          parse: true
        });

        Global.m.publish('news:updating', self.model);
      });
  },

  updateUnReadNum: function(data){
    var flag = false;
    if(data){
      if(_(data.unReadLetter).isFinite()){
        this.model.set({
          unReadLetter: data.unReadLetter
        });
        flag = true;
      }
      if(_(data.unReadNotice).isFinite()){
        this.model.set({
          unReadNotice: data.unReadNotice
        });
        flag = true;
      }
      if(flag){
        Global.m.publish('news:updating', this.model);
      }
    }
  },

  onStop: function() {
    Global.polling.stop('news:request');
  }
});

module.exports = NewsMediatorModule;
