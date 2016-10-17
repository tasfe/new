"use strict";

var Collection = require('skeleton/collection');

var ChatUserModel = require('./chatUserModel');

var ChatUsersCollection = Collection.extend({
  model: ChatUserModel,

  modelId: function(userInfo) {
    return userInfo.userId;
  },

  getCurrentChatUser: function() {
    return this.findWhere({
      active: true
    });
  },

  destroyAllChat: function() {
    var model;

    while (model = this.shift()) {
      model.destroy();
    }
  },

  updateChat: function(userId) {
    this.findWhere({
      userId: userId
    }).fetchChatInfo();
  }
});

module.exports = ChatUsersCollection;
