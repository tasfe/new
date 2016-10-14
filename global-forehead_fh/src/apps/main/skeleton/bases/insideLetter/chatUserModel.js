"use strict";

var Model = require('skeleton/model');
var Collection = require('skeleton/collection');

var ChatUserModel = Model.extend({

  url: '/acct/usermsg/msglist.json',

  idAttribute: 'userId',

  defaults: {
    hasNew: false,
    last: true
  },

  chatTimer: null,

  pageSize: 5,

  parse: function(res, remoteOptions) {
    var hasNew = false;
    var chatList;
    var last = true;
    res.root = res.root || {};
    if(res && res.result === 0) {
      chatList = _(res.root || []).reduceRight(function(chatData, chat) {
        chatData.push({
          messageId: chat.messageId,
          content: chat.content,
          sendTime: chat.sendTime,
          isSender: chat.sendId === Global.memoryCache.get('acctInfo').userId
        });
        return chatData;
      }, []);

      var currentChatCollection = this.get('chatList');

      if (currentChatCollection.isEmpty()) {
        currentChatCollection.set(chatList);
        hasNew = true;
      } else {
        _(chatList).each(function(info) {
          var find = currentChatCollection.findWhere({
            messageId: info.messageId
          });
          if (!find) {
            currentChatCollection.add(info);
            hasNew = true;
          }
        }, this);

        currentChatCollection.sortBy('sendTime');
      }

      if (chatList.length >= this.pageSize) {
        last = false;
      }
    }

    if (hasNew) {
      return {
        lastMsgId: remoteOptions.data.lastMsgId,
        // chatList: currentChatCollection,
        hasNew: hasNew,
        last: last
      };
    } else {
      return {
        lastMsgId: remoteOptions.data.lastMsgId,
        // chatList: currentChatCollection,
        last: last
      };
    }
  },

  initialize: function() {
    var self = this;

    this.set('chatList', new Collection(), {
      silent: true
    });

    this.on('change:active', function(currentModel, active) {
      if (active) {
        this.collection.chain().filter(function(model) {
          return currentModel !== model && model.get('active');
        }).each(function(model) {
          model.set('active', false);
        });
      }
    });

    this.fetchChatInfo();

    this.chatTimer = window.setInterval(function() {
      self.fetchChatInfo();
    }, 3000);
  },

  getHistory: function() {
    if (!this.get('last')) {
      this.fetchChatInfo(this.get('chatList')[0].id);
    }
  },

  fetchChatInfo: function(lastMsgId) {
    this.fetch({
      data: {
        userId: this.get('userId'),
        pageSize: this.pageSize,
        lastMsgId: lastMsgId
      },
      abort: false
    });
  },

  destroy: function() {
    window.clearInterval(this.chatTimer);
  }
});

module.exports = ChatUserModel;
