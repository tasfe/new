"use strict";

var MessageModel = require('skeleton/models/message');

var MessageMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  initialize: function() {
    _.bindAll(this, 'fetch');
    this.model = Global.data.set('messageModel', new MessageModel());
  },

  onStart: function() {
    var self = this;

    Global.polling.start('message:request', function() {
      self.fetch()
        .always(function() {
          Global.polling.next('message:request', {
            interval: self.interval
          });
        });
    });
  },

  setRead: function(id) {
    return this.model.setReadLetterXhr(id);
  },

  fetch: function() {
    var self = this;

    return Global.sync.ajax({
      url: '/acct/usermsg/msgstat.json',
      abort: false
    })
      .done(function (res) {
        var data;
        if (res && res.result === 0) {
          data = res.root || {};
          self.model.set({
            parent: data.parent || {},
            subList:data.subList || []
          }, {
            parse: true
          });

          var newsNum = 0;

          newsNum += data.parent.newMsgNum;

          for (var i = data.subList.length - 1; i >= 0; i--) {
            newsNum += data.subList[i].newMsgNum;
          }
          
          $('.js-gl-letter-unread').html('<span>'+newsNum+'</span>');

          Global.m.publish('message:updating', self.model);
        }
      });
  },

  updateUnReadNum: function(data) {
    var flag = false;
    if(data) {
      if(_(data.unReadLetter).isFinite()) {
        this.model.set({
          unReadLetter: data.unReadLetter
        });
        flag = true;
      }

      if(flag) {
        Global.m.publish('message:updating', this.model);
      }
    }
  },

  onStop: function() {
    Global.polling.stop('message:request');
  }
});

module.exports = MessageMediatorModule;
