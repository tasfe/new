"use strict";

var NewsBarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  initialize: function() {
  },

  serializeData: function() {
    var model = Global.data.get('newsModel');

    var data = model.toJSON();

    _(data.noticeList).each(function(notice) {
      switch (notice.type) {
        case 0:
          break;
        case 2:
          notice.title = notice.title + '<a href="#as/ll" class="router">操作日志</a>';
          break;
        default:
          notice.title = '<a href="#nc/pn/detail/' + notice.noticeId + '" class="router">' + notice.title + '</a>';
          break;
      }
    });

    return data;
  },

  onRender: function() {
    var self = this;
    //this.subscribe('acct', 'acctUpdating', function() {
    //  self.renderAcctInfo();
    //});
  },

  hidden: function() {
    this.setRead();
  },

  setRead: function() {
    var model = Global.data.get('newsModel');
    model.setReadNoticeXhr();
  }

});

module.exports = NewsBarView;
