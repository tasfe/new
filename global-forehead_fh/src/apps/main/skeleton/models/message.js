"use strict";

var Model = require('skeleton/model');

var MessageModel = Model.extend({

  defaults: {
    parent: {},
    subList: []
  },

  setReadLetterXhr: function(id) {
    if (id) {
      return Global.sync.ajax({
        url: '/acct/usermsg/read.json',
        data: {
          userId: id
        }
      })
        .always(function() {
          Global.m.message.fetch();
        });
    }
  },

  getUnreadCount: function() {
    var parent = this.get('parent');
    var subList = this.get('subList');

    return (parent.newMsgNum || 0) + _(subList).reduce(function(unReadCount, info) {
        return unReadCount + info.newMsgNum;
      }, 0);
  }
});

module.exports = MessageModel;