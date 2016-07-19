"use strict";

require('./index.scss');

var Chat = Base.PrefabView.extend({
  template: require('./index.html'),

  className: 'chat',

  tagName: 'ul',

  options: {
    prevClass: 'js-pf'
  },

  initialize: function() {
    this._chatData = [];
  },

  render: function(chatData) {
    if (chatData) {
      this.$el.html(_(this.template).template()({
        chatData: this._push(chatData)
      }));
    }

    return this;
  },

  add: function(chatInfo) {
    if (chatInfo) {
      this.$el.append(_(this.template).template()({
        chatData: [this._push(chatInfo)]
      }));
    }

    return this;
  },

  prepend: function(chatData) {
    if (chatData) {
      this.$el.prepend(_(this.template).template()({
        chatData: this._push(chatData)
      }));
    }

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
  }
});

module.exports = Chat;
