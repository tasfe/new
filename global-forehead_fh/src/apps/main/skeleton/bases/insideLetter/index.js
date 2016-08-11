"use strict";

require('./index.scss');

var LowMultiSelect = require('com/lowMultiSelect');

var Chat = require('com/chat');

var InsideLetterView = Base.ItemView.extend({

  template: require('./index.html'),

  options: {
    pageSize: 10
  },

  events: {
    'click .js-nc-type-toggle': 'chatTypeToggleHandler',
    'keydown .js-single-content': 'singleContentHandler',
    'keydown .js-multi-content': 'multiContentHandler',
    'submit .js-nc-single': 'sendSingleChatHandler',
    'submit .js-nc-multi': 'sendMultiChatHandler'
  },

  initialize: function() {
    this.chatList = {};
    this.currentChatTimer = null;
  },

  getChatXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/usermsg/msglist.json',
      data: _(data).defaults({
        pageSize: this.options.pageSize
      })
    });
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
    this.$single = this.$('.js-nc-single');
    this.$singleSelect = this.$('.js-single-lowLevelSelect');
    this.$singleContent = this.$('.js-single-content');
    this.$singleToUser = this.$('.js-single-to-user');
    this.$singleChat = this.$('.js-single-container');
    this.$singleTitle = this.$('.js-chat-title');
    this.$singlePartner = this.$('.js-chat-partner');
    this.$singleStatistics = this.$('.js-single-statistics');
    this.$singleSubmit = this.$('.js-single-submit');

    //群发
    this.$multi = this.$('.js-nc-multi');
    this.$multiSelect = this.$('.js-multi-lowLevelSelect');
    this.$multiContent = this.$('.js-multi-content');
    this.$multiToUser = this.$('.js-multi-to-user');
    this.$multiChat = this.$('.js-multi-container');
    this.$multiStatistics = this.$('.js-multi-statistics');
    this.$multiSubmit = this.$('.js-multi-submit');

    this.$singleStatistics.statistics({
      targetEl: this.$singleContent,
      onChange: function(count, flag) {
        self.$singleSubmit.prop('disabled', flag);
      }
    });

    this.singleSelect = new LowMultiSelect({
      select: false,
      showUnread: true,
      selectAll: false
    })
      .on('select:change', function(list) {
        self.showCurrentSingleChat(list[0], true);
      });

    if (this.options.reqData && this.options.reqData.userId) {
      this.singleSelect.selectUser(this.options.reqData.userId, this.options.reqData.name);
    }

    this.$singleSelect.html(self.singleSelect.render().el);

    this.singleChat = new Chat();
    this.$singleChat.html(this.singleChat.render().el);

    //群聊

    this.$multiStatistics.statistics({
      targetEl: this.$multiContent,
      onChange: function(count, flag) {
        self.$multiSubmit.prop('disabled', flag);
      }
    });

    this.multiSelect = new LowMultiSelect({
      showUnread: true
    })
      .on('select:change', function(list) {
        self.showCurrentMultiChat(list);
      });

    this.$multiSelect.html(self.multiSelect.render().el);

    this.multiChat = new Chat();

    this.$multiChat.html(this.multiChat.render().el);

    this.$singleChat.on('scroll', function(e) {
      self.scrollToPrevHandler(e);
    });
  },

  pullChat: function(ops) {
    var self = this;

    return this.getChatXhr({
      userId: ops.userId,
      lastMsgId: ops.lastMsgId
    })
    .done(function(res) {
      var list;
      res.root = res.root || {};
      if (res && res.result === 0) {
        list = res.root || [];

        var hasNew = self.renderLetterChat(list, ops.userId, !!ops.lastMsgId);

        if (!ops.lastMsgId) {
          if (hasNew) {
            Global.m.message.setRead(ops.userId);
          }
          if (ops.scroll) {
            self.$singleChat.scrollTop(self.singleChat.height());
          }
        }

      } else {
        Global.ui.notification.show('系统异常，请稍后再试');
      }
    });
  },

  renderLetterChat: function(chatData, userId, prepend) {
    var hasNew;
    chatData = _(chatData).reduceRight(function(chatData, chat) {
      chatData.push({
        id: chat.messageId,
        content: chat.content,
        sendTime: chat.sendTime,
        isSender: chat.sendId === Global.memoryCache.get('acctInfo').userId
      });

      return chatData;
    }, []);

    if (!this.chatList[userId]) {
      this.chatList[userId] = {
        list: chatData
      };

      hasNew = true;
    } else {
      _(chatData).each(function(info) {
        var find = _(this.chatList[userId].list).findWhere({
          sendTime: info.sendTime
        });
        if (!find) {
          this.chatList[userId].list.push(info);
          hasNew = true;
        }
      }, this);
      this.chatList[userId].list = _(this.chatList[userId].list).sortBy('sendTime');
    }

    if (chatData.length < this.options.pageSize) {
      this.chatList[userId].last = true;
    }

    if (prepend) {
      this.singleChat.prepend(chatData);
    } else {
      this.$singleChat.html(this.singleChat.render(this.chatList[userId].list).el);
    }

    return hasNew;
  },

  showCurrentSingleChat: function(partner, scroll) {
    var self = this;
    this.$singleTitle.removeClass('hidden');
    this.$singlePartner.text(partner.name);
    this.$singleToUser.val(partner.id);

    this.currentId = partner.id;

    window.clearInterval(this.currentChatTimer);

    this.pullChat({
      userId: partner.id,
      scroll: scroll
    });

    this.currentChatTimer = window.setInterval(function() {
      self.pullChat({
        userId: partner.id
      });
    }, 3000);

  },

  showCurrentMultiChat: function(partners) {
    this.$multiToUser.val(_(partners).pluck('id').join(','));
  },

  //event handlers

  chatTypeToggleHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.addClass('active');
    $target.siblings().removeClass('active');
    if ($target.data('type') === 'single') {
      this.$single.removeClass('hidden');
      this.$multi.addClass('hidden');
    } else {
      this.$single.addClass('hidden');
      this.$multi.removeClass('hidden');
    }
  },

  scrollToPrevHandler: function(e) {
    var $target = $(e.currentTarget);
    if ($target.scrollTop() <= 0 && !this.chatList[this.currentId].last) {
      this.pullChat({
        userId: this.currentId,
        lastMsgId: this.chatList[this.currentId].list[0].id
      });
    }
  },

  singleContentHandler: function(e) {
    if(e.keyCode == 13 || e.ctrlKey && e.keyCode === 83) {
      this.$singleSubmit.click();
      return false;
    }
  },

  multiContentHandler: function(e) {
    if(e.keyCode == 13 || e.ctrlKey && e.keyCode === 83) {
      this.$multiSubmit.click();
      return false;
    }
  },

  sendSingleChatHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var reqData = _($target.serializeArray()).serializeObject();

    reqData.content = _(reqData.content).chain().trim().escape().value();
    if (!reqData.content || !reqData.toUser) {
      return false;
    }

    //this.singleChat.add({
    //  //sender: '',
    //  content: reqData.content,
    //  sendTime: _(_.now()).toTime(),
    //  isSender: true
    //});

    this.$singleContent.val('');
    this.$singleChat.scrollTop(this.singleChat.height());

    this.sendChatXhr(_(reqData).extend({
      toUser: reqData.toUser
    }))
      .done(function(res) {
        if (res && res.result !== 0) {
          Global.ui.notification.show('系统异常，发送失败');
        } else {
          self.pullChat({
            userId: reqData.toUser,
            scroll: true
          });
        }
      });
  },

  sendMultiChatHandler: function(e) {
    var $target = $(e.currentTarget);
    var reqData = _($target.serializeArray()).serializeObject();

    reqData.content = _(reqData.content).chain().trim().escape().value();
    if (!reqData.content || !reqData.toUser) {
      return false;
    }

    this.multiChat.add({
      sender: '我',
      content: reqData.content,
      sendTime: _(_.now()).toTime(),
      isSender: true
    });

    this.$multiContent.val('');
    this.$multiChat.scrollTop(this.multiChat.height());

    this.sendChatXhr(_(reqData).extend({
      toUser: reqData.toUser
    }))
      .done(function(res) {
        if (res && res.result !== 0) {
          Global.ui.notification.show('系统异常，发送失败');
        }
      });
  },

  destroy: function() {
    window.clearInterval(this.currentChatTimer);

    Base.ItemView.prototype.destroy.apply(this, arguments);
  }
});

module.exports = InsideLetterView;
