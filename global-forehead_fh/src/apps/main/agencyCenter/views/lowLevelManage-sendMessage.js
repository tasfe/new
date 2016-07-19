"use strict";

var InsideLetterSendView = require('newsCenter/views/insideLetterSend');

var LowLevelSendMessageView = InsideLetterSendView.extend({

  className: 'nc-letter-send inner nc-panel-wrapper',

  initialize: function(options) {
    InsideLetterSendView.prototype.initialize.apply(this, arguments);

    _(this.options).extend({
      reqData: {
        userId: options.userId,
        username: _.getUrlParam('name')
      }
    });

    //this.template = '<div class="clearfix">' +
    //  '<button class="btn btn-sm btn-inverse pull-right sub-return" type="button">返回</button>' +
    //  '<label>给' + _.getUrlParam('name') + '发消息</label></div><hr />' +
    //  this.template;
  }
});

module.exports = LowLevelSendMessageView;
