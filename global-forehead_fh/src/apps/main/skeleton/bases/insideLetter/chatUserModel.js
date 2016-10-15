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

  pageSize: 20,

  parse: function(res, remoteOptions) {
    var self = this;
    var hasNew = false;
    var chatList;
    var last = false;
    var results = {};

    res.root = res.root || {};

    if(res && res.result === 0) {
      chatList = _(res.root || []).reduceRight(function(chatData, chat) {
        chatData.push({
          messageId: chat.messageId,
          content: chat.content.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp face-$1"></span>'),
          sendTime: chat.sendTime,
          isSender: chat.sendId === Global.memoryCache.get('acctInfo').userId,
          headId: self.get('headId'),
          sender: self.get('username')
        });
        return chatData;
      }, []);

      var currentChatCollection = this.get('chatList');

      if (currentChatCollection.isEmpty()) {
        currentChatCollection.set(chatList, {
          silent: true
        });
        hasNew = true;
        results.last = chatList.length < this.pageSize;
      } else {
        _(chatList).each(function(info) {
          var find = currentChatCollection.findWhere({
            messageId: info.messageId
          });
          if (!find) {
            currentChatCollection.add(info, {
              silent: true
            });
            hasNew = true;
          }
        }, this);

        // currentChatCollection.sortBy('sendTime', {
        //   silent: true
        // });
      }
    }

    if (chatList.length < this.pageSize) {
      last = true;
    }

    results.lastMsgId = remoteOptions.data.lastMsgId;
    results.hasNew = hasNew;

    if (last) {
      results.last = true;
    }

    return results;
    // } else {
    //   return {
    //     lastMsgId: remoteOptions.data.lastMsgId,
    //     // chatList: currentChatCollection,
    //     last: last
    //   };
    // }
  },

  initialize: function() {
    var self = this;

    var chatCollection = new Collection();

    chatCollection.comparator = 'sendTime';

    this.set('chatList', chatCollection, {
      silent: true
    });

    this.on('sync', function() {
      var chatListCollection = this.get('chatList');
      chatListCollection.trigger('update', chatListCollection);
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
      this.fetchChatInfo(this.get('chatList').first().get('messageId'));
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
