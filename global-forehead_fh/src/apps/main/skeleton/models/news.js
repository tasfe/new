"use strict";

var Model = require('skeleton/model');

var NewsModel = Model.extend({

  defaults: {
    letterList: [],
    letterRowCount: 0,
    unReadLetter: 0,

    noticeList: [],
    noticeRowCount: 0,
    unReadNotice: 0
  },

  setReadNoticeXhr: function(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('noticeList')).pluck('noticeId');
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/savenoticetoread.json',
        tradition: true,
        data: {
          list: idList
        }
      })
        .always(function() {
          Global.m.news.fetchNews();
        });
    }
  },

  deleteNoticeXhr: function(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('noticeList')).pluck('noticeId');
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/delnoticelist.json',
        tradition: true,
        data: {
          list: idList
        }
      })
        .always(function() {
          Global.m.news.fetchNews();
        });
    }
  },

  setReadLetterXhr: function(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('letterList')).pluck('letterId');
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/savelettertoread.json',
        tradition: true,
        data: {
          list: idList
        }
      })
        .always(function() {
          Global.m.news.fetchNews();
        });
    }
  },

  deleteLetterXhr: function(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('letterList')).pluck('letterId');
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/deletter.json',
        tradition: true,
        data: {
          list: idList
        }
      })
        .always(function() {
          Global.m.news.fetchNews();
        });
    }
  },

  getUnreadCount: function() {
    return this.get('unReadLetter') + this.get('unReadNotice');
  }
});

module.exports = NewsModel;
