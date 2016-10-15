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

  renderChatContent: function(chatList, isLastMsg, prepend) {
    var html;
    if (chatList) {
      html = _(this.template).template()({
        chatData: this._push(chatList),
        isLastMsg: isLastMsg
      });

      if (!prepend) {
        this.$el.html(html);
      } else {
        this.$el.prepend(html);
      }
    }
  },

  add: function(chatInfo) {
    this.renderChatContent([chatInfo]);

    return this;
  },

  prepend: function(chatData, isLastMsg) {
    this.renderChatContent(chatData, isLastMsg, true);
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
      _(chatData).reduce(function(prevTime, chatInfo) {
        chatInfo.hasTitle = Math.abs(chatInfo.sendTime - prevTime) > 60000;
        return chatInfo.sendTime;
      }, 0);
      this._chatData = chatData;
    } else {
      var prevInfo = _(this._chatData).last();

      if (prevInfo) {
        chatData.hasTitle = Math.abs(chatData.sendTime - prevInfo.sendTime) > 60000;
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
