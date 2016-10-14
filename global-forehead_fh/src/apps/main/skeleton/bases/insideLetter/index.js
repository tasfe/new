"use strict";

require('./index.scss');

var LowMultiSelect = require('com/lowMultiSelect');

var Chat = require('com/chat');

var ChatUsersCollection = require('./chatUsersCollection');

var SingleChatView = Base.ItemView.extend({
  template: require('./chatUser.html'),

  events: {
    'click .js-chat-user': 'activeChatUserHandler'
  },

  serialize: function() {
    return this.model.toJSON();
  },

  initialize: function() {
    this.listenTo(this.model, 'change:hasNew', function(model, hasNew) {
      if(!model.get('active') || !hasNew) {
        this.$chatUser.toggleClass('new-msg', hasNew);
      }
    });

    this.listenTo(this.model, 'change:active', function(model, active) {
      this.$chatUser.toggleClass('active', active);

      if(active) {
        model.set('hasNew', false);
      }
    });
  },

  onRender: function() {
    this.$chatUser = this.$('.js-chat-user');
  },

  activeChatUserHandler: function() {
    this.model.set('active', true);
  }
});

var InsideLetterView = Base.ItemView.extend({

  template: require('./index.html'),

  className: 'inside-letter',
  options: {
    pageSize: 20
  },

  faceArry: [],

  faceArry2: [],

  events: {
    'click .js-inside-letter-title': 'toggleHandler',
    'keydown .js-single-content': 'singleContentHandler',
    'submit .js-chat-form': 'sendSingleChatHandler',
    'click .js-chat-close': 'closeChatHandler',
    'click .js-chat-exp-pack': 'toggleExpPackHandler',
    'click .js-chat-exp': 'selectExpHandler'
  },

  initialize: function() {
    this.collection = new ChatUsersCollection();
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
    this.$singleSelect = this.$('.js-single-lowLevelSelect');
    this.$singleContent = this.$('.js-single-content');
    this.$singleChat = this.$('.js-single-container');
    this.$singleStatistics = this.$('.js-single-statistics');
    this.$singleSubmit = this.$('.js-single-submit');

    this.$chatBox = this.$('.js-chat-box');
    this.$chatUserList = this.$('.js-chat-user-list');
    this.$currentChatUser = this.$('.js-chat-current-user');

    this.$expPackInner = this.$('.js-chat-exp-pack-inner');


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
    });

    this.$singleSelect.html(self.singleSelect.render().el);

    this.singleChat = new Chat();

    this.$singleChat.html(this.singleChat.render().el);

    this.singleSelect.on('select:change', function() {
      self.selectChatUser.apply(self, arguments);
    });

    if(this.options.reqData && this.options.reqData.userId) {
      this.singleSelect.selectUser(this.options.reqData.userId, this.options.reqData.name);
    }

    this.$singleChat.on('scroll', _(function(e) {
      self.scrollToPrevHandler(e);
    }).debounce(1000));
  },

  selectChatUser: function(selectedUsers) {
    var prevLength = this.collection.length;
    var selectedUser = selectedUsers[0];
    var chatModel = this.collection.add(selectedUser);

    var isNew = this.collection.length !== prevLength;

    if(isNew) {
      this.$chatUserList.append(
        new SingleChatView({
          model: chatModel
        }).render().$el
      );


      this.setCurrentChat(chatModel.id);

      chatModel.on('change:active', function(model) {
        this.$currentChatUser.text(model.get('username'));
        if(!model.get('active')) {
          model.set('scrollTop', this.$singleChat.scrollTop());
        } else {
          this.setCurrentChat(chatModel.id);
          this.$singleChat.scrollTop(model.get('scrollTop') || this.singleChat.height());
        }
      }, this);
    }

    chatModel.set('active', true);

    this.toggleChatBox(true);
  },

  setCurrentChat: function(modelId) {
    if(this.currentChatModel) {
      this.currentChatModel.get('chatList').off('update', this.showCurrentChat, this);
    }

    this.currentChatModel = this.collection.get(modelId);
    var chatListCollection = this.currentChatModel.get('chatList');

    chatListCollection.on('update', this.showCurrentChat, this).trigger('update', chatListCollection);
  },

  showCurrentChat: function(chatList) {
    if(this.currentChatModel.get('lastMsgId')) {
      this.singleChat.prepend(chatList.toJSON());
      this.$singleChat.scrollTop(0);
    } else {
      this.singleChat.render(chatList.toJSON());
      this.$singleChat.scrollTop(this.singleChat.height());
    }
  },

  toggleChatBox: function(show) {
    this.$chatBox.toggleClass('hidden', !show);
  },

  showCurrentMultiChat: function(partners) {
    this.$multiToUser.val(_(partners).pluck('id').join(','));
  },

  //event handlers

  toggleHandler: function(e) {
    this.$el.toggleClass('open');
  },

  closeChatHandler: function() {
    this.$chatBox.addClass('hidden');
  },

  toggleExpPackHandler: function(e) {
    this.$expPackInner.toggleClass('hidden');
  },

  singleContentHandler: function(e) {
    if(e.keyCode == 13 || e.ctrlKey && e.keyCode === 83) {
      this.$singleSubmit.click();
      return false;
    }
  },

  selectExpHandler: function(e) {
    var $target = $(e.currentTarget);
    var expId = $target.data('id');
    this.$singleContent.val(this.$singleContent.val() + expId)
      .trigger('input').trigger('propertychange');
  },

  scrollToPrevHandler: function(e) {
    var $target = $(e.currentTarget);

    if($target.scrollTop() <= 0) {
      this.currentChatModel.getHistory();
    }
  },

  sendSingleChatHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var reqData = _($target.serializeArray()).serializeObject();

    reqData.toUser = this.collection.getCurrentChatUser().id;
    reqData.content = _(reqData.content).chain().trim().escape().value();

    if (!reqData.content || !reqData.toUser) {
      return false;
    }


    this.$singleContent.val('');
    this.$singleChat.scrollTop(this.singleChat.height());

    this.sendChatXhr(reqData)
      .done(function(res) {
        if (res && res.result !== 0) {
          Global.ui.notification.show('系统异常，发送失败');
        } else {
          self.collection.updateChat(reqData.toUser);
        }
      });
  }
});

module.exports = InsideLetterView;