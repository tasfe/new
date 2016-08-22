"use strict";

require('./index.scss');

var LowMultiSelect = require('com/lowMultiSelect2');

var Chat = require('com/chat');

var InsideLetterView = Base.ItemView.extend({

  template: require('./index.html'),

  options: {
    pageSize: 10
  },

  events: {
    'keydown .js-single-content': 'singleContentHandler',
    'click .js-single-submit': 'sendSingleChatHandler'
  },

  initialize: function() {
    this.chatList = {};
    this.currentChatTimer = null;
  },

  getChatXhr: function() {
    var num = $('.js-selected-container li').length;
    var userId = sessionStorage.getItem('selectUserId');

    return Global.sync.ajax({
      url: '/acct/usermsg/msglist.json',
      data: {
        userId: userId,
        pageSize: this.options.pageSize
      }
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
    this.$singleSelect = this.$('.js-single-lowLevelSelect');
    this.$singleContent = this.$('.js-single-content');
    this.$singleChat = this.$('.js-single-container');
    this.$singleStatistics = this.$('.js-single-statistics');
    this.$singleSubmit = this.$('.js-single-submit');


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

    $('.js-single-to-user').change(function(){
      self.showCurrentSingleChat();
    });

    if (this.options.reqData && this.options.reqData.userId) {
      this.singleSelect.selectUser(this.options.reqData.userId, this.options.reqData.name);
      
    }
  },

  pullChat: function() {
    var self = this;

    if ($('.js-selected-container li').length > 0) {
      return this.getChatXhr()
      .done(function(res) {
        var list;
        res.root = res.root || {};
        if (res && res.result === 0) {
          list = res.root || [];
          var acctInfo = Global.memoryCache.get('acctInfo');

          var num = $('.js-selected-container li').length;
          var userId = 0;

          if ( sessionStorage.getItem('selectUserId') == 0) {
            userId = $('.js-selected-container li').eq(num - 1).data('id');
            sessionStorage.setItem('selectUserId',userId)
          }
          else{
            userId = sessionStorage.getItem('selectUserId');
          }

          $('.js-selected-container li').removeClass('sd');

          for (var i = $('.js-selected-container li').length - 1; i >= 0; i--) {
            if( $('.js-selected-container li').eq(i).data('id') == userId ){
              $('.js-selected-container li').eq(i).addClass('sd');
            }
          }

          if (!jQuery.isEmptyObject(list)) {
      //      if (hasNew) {
      //        Global.m.message.setRead(userId);
      //      }

            if(sessionStorage.getItem('message') != list[list.length -1].messageId && sessionStorage.getItem('message') != null || $('.js-single-container ul').html() == ''){
              sessionStorage.setItem('message', list[list.length -1].messageId);
              $('.js-single-container ul').html('');
              var arr = new Array();
              var arr2 = new Array();
              for (var i = 0; i < $('.js-wt-title').length; i++) {
                arr[$('.js-wt-title').eq(i).data('no')] = $('.js-wt-title').eq(i).data('headid');
                arr2[$('.js-wt-title').eq(i).data('no')] = $('.js-wt-title').eq(i).data('name');
              }

              arr[acctInfo.userId] = acctInfo.headId;
              arr2[acctInfo.userId] = acctInfo.username;

              arr[$('.js-pf-select-superior').data('id')] = $('.js-pf-select-superior').data('headid');
              arr2[$('.js-pf-select-superior').data('id')] = '我的上级';

              var acctInfo = Global.memoryCache.get('acctInfo');

              var list2 = _(list).sortBy('sendTime');
              _(list2).each(function(info) {
                if (acctInfo.userId == info.sendId) {
                  $('.js-single-container ul').append('<li class="me"><p>' + arr2[info.sendId] +' : ' + _(info.sendTime).toTime('HH') + ':' + _(info.sendTime).toTime('mm') + '</p><div><i class="iconsImage' + arr[info.sendId] + '"></i><b></b><span>' + info.content + '</span></div></li>');
                }
                else{
                  $('.js-single-container ul').append('<li class="other"><p>' + arr2[info.sendId] +' : ' + _(info.sendTime).toTime('HH') + ':' + _(info.sendTime).toTime('mm') + '</p><i class="iconsImage' + arr[info.sendId] + '"></i><div><span>' + info.content + '</span><b></b><b class="b2"></b></div></li>');
                }
              });
            }

            if ($('.js-single-container').height() > 300) {
              self.$('.js-single-detail-form').scrollTop($('.js-single-container').height() - 280);
            }
          }
          else{
            $('.js-single-container ul').html('');
          }
        } else {
          Global.ui.notification.show('系统异常，请稍后再试');
        }
      });
    }
    else{
      $('.js-single-container ul').html('');
    }
  },

  showCurrentSingleChat: function() {
    var self = this;

    window.clearInterval(this.currentChatTimer);
    this.pullChat();

    this.currentChatTimer = window.setInterval(function() {
      self.pullChat();
    }, 3000);
  },

  showCurrentMultiChat: function(partners) {
    this.$multiToUser.val(_(partners).pluck('id').join(','));
  },

  singleContentHandler: function(e) {
    if(e.keyCode == 13 || e.ctrlKey && e.keyCode === 83) {
      this.$singleSubmit.click();
      return false;
    }
  },

  sendSingleChatHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var content = $('.js-single-content').val();
    var toUser = $('.js-selected-container li');
    content = _(content).chain().trim().escape().value();

    if (content != '') {
      if (toUser.length == 0) {
        $('.js-single-container ul').append('<li class="tips"><span>请选择通话的人后再发送消息！</span></li>');
      }
      else{
        var strToUser = '';

        for (var i = 0; i < toUser.length; i++) {
          if (i != 0) {
            strToUser += ',';
          }
          strToUser += toUser.eq(i).data('id');
        }

        var strToUserName = '';

        for (var i = 0; i < toUser.length; i++) {
          if (i != 0) {
            strToUserName += ' | ';
          }
          strToUserName += toUser.eq(i).text();
        }

        var myDate = new Date();
        var hours = myDate.getHours();
        if (hours < 10) {
          hours = '0' + hours;
        }

        var minutes =  myDate.getMinutes();
        if (minutes < 10) {
          minutes = '0' + minutes;
        }

        var acctInfo = Global.memoryCache.get('acctInfo');
        $('.js-single-container ul').append('<li class="me"><p>' + strToUserName + ' : ' + hours + ':' + minutes + '</p><div><i class="iconsImage' + acctInfo.headId + '"></i><b></b><span>' + content + '</span></div></li>');
        $('.js-single-content').val('');

        this.sendChatXhr({
          parentId: $('.js-pf-select-superior').data('id'),
          content: content,
          toUser: strToUser
        })
        .done(function(res) {
          if (res && res.result !== 0) {
            Global.ui.notification.show('系统异常，发送失败');
          }
        });
      }

      if ($('.js-single-container').height() > 300) {
        self.$('.js-single-detail-form').scrollTop($('.js-single-container').height() - 280);
      }
    }
  },

  destroy: function() {
    window.clearInterval(this.currentChatTimer);

    Base.ItemView.prototype.destroy.apply(this, arguments);
  }
});

module.exports = InsideLetterView;