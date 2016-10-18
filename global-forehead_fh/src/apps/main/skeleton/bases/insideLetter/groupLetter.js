"use strict";

require('./index.scss');

var LowMultiSelect = require('com/lowMultiSelect');

var Chat = require('com/chat');

var GroupLetterView = Base.ItemView.extend({

  template: require('./groupLetter.html'),

  className: 'group-letter clearfix',

  events: {
    'click .js-chat-exp-pack': 'toggleExpPackHandler',
    'click .js-chat-exp': 'selectExpHandler',
    'submit .js-chat-form': 'sendHandler'
  },

  sendChatXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/usermsg/send.json',
      abort: false,
      data: data
    });
  },

  onRender: function() {
    var self = this;

    //单聊
    this.$lowLevelSelect = this.$('.js-single-lowLevelSelect');
    this.$content = this.$('.js-single-content');
    this.$chat = this.$('.js-single-container');
    this.$statistics = this.$('.js-single-statistics');
    this.$submit = this.$('.js-single-submit');

    this.$chatBox = this.$('.js-chat-box');
    this.$chatUserList = this.$('.js-chat-user-list');
    this.$selectedUsers = this.$('.js-group-selected-users');

    this.$expPackInner = this.$('.js-chat-exp-pack-inner');


    this.$statistics.statistics({
      targetEl: this.$content,
      onChange: function(count, flag) {
        self.$submit.prop('disabled', flag);
      }
    });

    this.lowLevelSelect = new LowMultiSelect({
      select: true,
      showUnread: true,
      update: false,
      showParent: false,
      selectAll: false
    });

    this.$lowLevelSelect.html(self.lowLevelSelect.render().el);

    this.chat = new Chat();

    this.$chat.html(this.chat.render().el);

    this.lowLevelSelect.on('select:change', function() {
      self.selectChatUser.apply(self, arguments);
    });

    if(this.options.reqData && this.options.reqData.userId) {
      this.lowLevelSelect.selectUser(this.options.reqData.userId, this.options.reqData.name);
    }
  },

  selectChatUser: function(selectedUsers) {
    var html = _(selectedUsers).map(function(selectedUser) {
      return '<span>' + selectedUser.username + '</span>；';
    }).join('').slice(0, -1);

    this.$selectedUsers.html(html);
  },

  //event handlers
  toggleExpPackHandler: function(e) {
    this.$expPackInner.toggleClass('hidden');
  },

  selectExpHandler: function(e) {
    var $target = $(e.currentTarget);
    var expId = $target.data('id');
    this.$content.val(this.$content.val() + expId)
      .trigger('input').trigger('propertychange');
  },

  sendHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var reqData = _($target.serializeArray()).serializeObject();

    reqData.toUser = _(this.lowLevelSelect.getAll()).pluck('userId').join(',');
    reqData.content = _(reqData.content).chain().trim().escape().value();

    if (!reqData.content) {
      return false;
    }

    if (!reqData.toUser) {
      Global.ui.notification.show('请选择要发消息的对象');

      return false;
    }

    this.chat.add({
      sender: '我',
      content: reqData.content.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp face-$1"></span>'),
      sendTime: _(_.now()).toTime(),
      headId: Global.memoryCache.get('acctInfo').headId,
      hasTitle: true,
      isSender: true
    });

    this.$content.val('');
    this.$chat.scrollTop(this.chat.height());

    this.sendChatXhr(_(reqData).extend({
      toUser: reqData.toUser
    }))
      .done(function(res) {
        if (res && res.result !== 0) {
          Global.ui.notification.show('系统异常，发送失败');
        }
      });
  }
});

module.exports = GroupLetterView;