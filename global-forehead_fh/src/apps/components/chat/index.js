"use strict";

require('./index.scss');

var Chat = Base.PrefabView.extend({
  template: require('./index.html'),

  className: 'chat',

  tagName: 'ul',

  options: {
    prevClass: 'js-pf'
  },

  events: {
    'click .js-chat-get-history': 'getHistoryHandler'
  },

  initialize: function() {
    this._chatData = [];
  },

  render: function(chatData, isLastMsg) {
    this.renderChatContent(chatData, isLastMsg);

    return this;
  },

  renderChatContent: function(chatList, isLastMsg, action) {
    action = action || 'html';
    var html;
    if (chatList) {
      html = _(this.template).template()({
        chatData: this._push(chatList),
        isLastMsg: isLastMsg
      });

      this.$el[action](html);
    }
  },

  add: function(chatInfo, isLastMsg) {
    isLastMsg = isLastMsg || true;
    this.renderChatContent(chatInfo, isLastMsg, 'append');

    return this;
  },

  prepend: function(chatData, isLastMsg) {
    this.renderChatContent(chatData, isLastMsg, 'prepend');
    // if (chatData) {
    //   this.$el.prepend(_(this.template).template()({
    //     chatData: this._push(chatData)
    //   }));
    // }

    return this;
  },

  empty: function() {
    return this.$el.empty();
  },

  height: function() {
    return this.$el.height();
  },

  _push: function(chatData) {
    if (_(chatData).isArray()) {
      _(chatData).reduce(function(prevInfo, chatInfo) {
        if (!_(chatInfo).isEmpty()) {
          chatInfo.hasTitle = Math.abs(chatInfo.sendTime - prevInfo.prevTime) > 60000 || prevInfo.sender !== chatInfo.sender;
        } else {
          chatInfo.hasTitle = true;
        }
        return chatInfo;
      }, {});
      this._chatData = chatData;
    } else {
      chatData = [chatData];
      var prevInfo = _(this._chatData).last();

      if (prevInfo) {
        chatData.hasTitle = Math.abs(chatData.sendTime - prevInfo.sendTime) > 60000;
      } else {
        chatData.hasTitle = true;
      }

      this._chatData.push(chatData);
    }

    return chatData;
  },

  getHistoryHandler: function() {
    this.trigger('get:history');
  }
});

module.exports = Chat;
