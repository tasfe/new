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

          if (data.parent != null) {
            newsNum += data.parent.newMsgNum;
          }

          var msgArry = [];
          var j = 0;
          if (data.subList != null) {
            for (var i = data.subList.length - 1; i >= 0; i--) {
              newsNum += data.subList[i].newMsgNum;
              j = data.subList[i].userId;
              msgArry[j] = data.subList[i].newMsgNum;
            }
          }

          $('.js-wt-title')

          var num = 0;
          for (var i = $('.js-wt-title').length - 1; i >= 0; i--) {
            num = msgArry[$('.js-wt-title').eq(i).data('no')];
            $('.js-wt-title b').eq(i).text(num);
            if (num == 0) {
              $('.js-wt-title b').eq(i).addClass('hidden');
            }
            else{
              $('.js-wt-title b').eq(i).removeClass('hidden');
            }
          }
          
          $('.js-gl-letter-unread').html('<span>'+newsNum+'</span>');

          if (sessionStorage.getItem('openMessage') == 1) {
            if (data.parent != null) {
              $('.js-pf-select-superior big').text(data.parent.newMsgNum);
            }
            
            if ( $('.js-pf-select-superior big').text() == 0 ) {
              $('.js-pf-select-superior big').addClass('hidden');
            }
            else{
              $('.js-pf-select-superior big').removeClass('hidden');
            }
          }


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
