"use strict";

require('./index.scss');

var LowMultiSelect = require('com/lowMultiSelect');

var Chat = require('com/chat');

var InsideLetterView2 = Base.ItemView.extend({

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
    'click .js-single-submit': 'sendSingleChatHandler',
    'click .js-fideInChat': 'fideInChat',
    'click .js-face span': 'clickFace'
  },

  clickFace: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    var str = $('.js-single-content').val() + $target.data('id');
    $('.js-single-content').val(str);
  },

  fideInChat: function() {
    this.$('.js-info-window').fadeOut("slow");
    $('.js-selected-container').fadeOut("slow");
  },

  initialize: function() {
    this.chatList = {};
    this.currentChatTimer = null;

    for(var i = 0; i < 18; i++) {
      j = i + 1;
      if(i < 9) {
        this.faceArry[i] = '[-f0' + j + '-]';
      }
      else {
        this.faceArry[i] = '[-f' + j + '-]';
      }
    }

    var j = 0;
    for(var i = 0; i < 18; i++) {
      j = i + 1;
      if(i < 9) {
        this.faceArry2[i] = '<span class="face0' + j + '"></span>';
      }
      else {
        this.faceArry2[i] = '<span class="face' + j + '"></span>';
      }
    }
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

    $('.js-single-to-user').change(function() {
      self.showCurrentSingleChat();
    });

    if(this.options.reqData && this.options.reqData.userId) {
      this.singleSelect.selectUser(this.options.reqData.userId, this.options.reqData.name);
    }
  },

  getFace: function(content) {
    var strContent = content;
    for(var i = 0; i < 18; i++) {
      strContent = strContent.replace(this.faceArry[i], this.faceArry2[i]);
      while(strContent.indexOf(this.faceArry[i]) > 0) {
        strContent = strContent.replace(this.faceArry[i], this.faceArry2[i]);
      }
    }
    return strContent;
  },

  pullChat: function() {
    var self = this;

    var num = $('.js-selected-container li').length;
    var userId = 0;

    if(sessionStorage.getItem('selectUserId') == 0) {
      userId = $('.js-selected-container li').eq(num - 1).data('id');
      sessionStorage.setItem('selectUserId', userId);
    }
    else if(sessionStorage.getItem('selectUserId') == -1) {
      userId = $('.js-selected-container li').eq(0).data('id');
      sessionStorage.setItem('selectUserId', userId);
    }
    else {
      userId = sessionStorage.getItem('selectUserId');
    }

    $('.js-selected-container li').removeClass('sd');
    $('.js-selected-container li').removeClass('sd2');
    for(var i = $('.js-selected-container li').length - 1; i >= 0; i--) {
      if($('.js-selected-container li').eq(i).data('id') == userId) {
        $('.js-selected-container li').eq(i).addClass('sd');
      }
    }

    $('.js-pf-jstree li a').removeClass('sd2');
    $('.js-pf-jstree li a').removeClass('sd3');
    for(var i = $('.js-pf-jstree li a').length - 1; i >= 0; i--) {
      if($('.js-pf-jstree li a').eq(i).data('no') == userId) {
        $('.js-pf-jstree li a').eq(i).addClass('sd3');
      }
    }

    for(var i = $('.js-wt-title').length - 1; i >= 0; i--) {
      if($('.js-wt-title').eq(i).data('no') == userId) {
        $('.js-wt-title b').eq(i).addClass('hidden');
      }
    }

    $('.js-pf-select-superior').removeClass('pf-select-superior-sd2');
    $('.js-pf-select-superior').removeClass('pf-select-superior-sd3');
    if($('.js-pf-select-superior').eq(0).data('id') == userId) {
      $('.js-pf-select-superior').addClass('pf-select-superior-sd2');
    }

    if($('.js-selected-container li').length > 0) {
      if($('.js-selected-container .sd').data('id') != sessionStorage.getItem('currentMessageId')) {
        $('.js-julien-loading').removeClass('hidden');
      }

      return this.getChatXhr()
        .fail(function() {
          if($('.js-selected-container .sd').data('id') != sessionStorage.getItem('currentMessageId')) {
            $('.js-single-container ul').html('');
          }
        })
        .done(function(res) {
          var list;
          res.root = res.root || {};
          if(res && res.result === 0) {
            list = res.root || [];
            var acctInfo = Global.memoryCache.get('acctInfo');

            if($('.js-pf-select-superior').hasClass('pf-select-superior-sd2')) {
              $('.js-pf-select-superior').addClass('pf-select-superior-sd3');
            }

            for(var i = $('.js-pf-jstree li a').length - 1; i >= 0; i--) {
              if($('.js-pf-jstree li a').eq(i).data('no') == userId) {
                $('.js-pf-jstree li a').eq(i).addClass('sd2');
              }
            }

            for(var i = $('.js-selected-container li').length - 1; i >= 0; i--) {
              if($('.js-selected-container li').eq(i).data('id') == userId) {
                $('.js-selected-container li').eq(i).addClass('sd2');
              }
            }

            if(!jQuery.isEmptyObject(list)) {
              if(sessionStorage.getItem('message') != list[list.length - 1].messageId && sessionStorage.getItem('message') != null || $('.js-single-container ul').html() == '') {
                sessionStorage.setItem('message', list[list.length - 1].messageId);

                $('.js-single-container ul').html('');
                var arr = new Array();
                var arr2 = new Array();
                for(var i = 0; i < $('.js-wt-title').length; i++) {
                  arr[$('.js-wt-title').eq(i).data('no')] = $('.js-wt-title').eq(i).data('headid');
                  arr2[$('.js-wt-title').eq(i).data('no')] = $('.js-wt-title').eq(i).data('name');
                }

                arr[acctInfo.userId] = acctInfo.headId;
                arr2[acctInfo.userId] = acctInfo.username;

                arr[$('.js-pf-select-superior').data('id')] = $('.js-pf-select-superior').data('headid');
                arr2[$('.js-pf-select-superior').data('id')] = '我的上级';

                var acctInfo = Global.memoryCache.get('acctInfo');

                Global.m.message.setRead(sessionStorage.getItem('selectUserId'));

                var list2 = _(list).sortBy('sendTime');
                var date = '';
                _(list2).each(function(info) {
                  if(date != _(info.sendTime).toDate()) {
                    date = _(info.sendTime).toDate();
                    $('.js-single-container ul').append('<li class="date-tips">' + _(info.sendTime).toDate() + '</li>');
                  }

                  if(acctInfo.userId == info.sendId) {
                    $('.js-single-container ul').append('<li class="other" data-id="' + info.messageId + '"><p>' + arr2[info.sendId] + ' : ' + _(info.sendTime).toTime('HH') + ':' + _(info.sendTime).toTime('mm') + '</p><i class="iconsImage' + arr[info.sendId] + '"></i><div><span>' + self.getFace(info.content) + '</span><b></b></div></li>');
                  }
                  else {
                    $('.js-single-container ul').append('<li class="me" data-id="' + info.messageId + '"><p>' + arr2[info.sendId] + ' : ' + _(info.sendTime).toTime('HH') + ':' + _(info.sendTime).toTime('mm') + '</p><i class="iconsImage' + arr[info.sendId] + '"></i><div><b></b><span>' + self.getFace(info.content) + '</span></div></li>');
                  }
                });

                if($('.js-single-container').height() > 100) {
                  self.$('.js-single-container').scrollTop($('.js-single-container .chat').height() - 240);
                }
              }
            }
            else {
              $('.js-single-container ul').html('');
            }
          } else {
            Global.ui.notification.show('系统异常，请稍后再试');
          }
        })
        .always(function() {
          $('.js-julien-loading').addClass('hidden');
          sessionStorage.setItem('currentMessageId', $('.js-selected-container .sd').data('id'));
        });
    }
    else {
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

  //event handlers

  toggleHandler: function(e) {
    this.$el.toggleClass('open');
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

    if(content != '') {
      if(toUser.length == 0) {
        $('.js-single-container ul').append('<li class="tips"><span>请选择通话的人后再发送消息！</span></li>');
      }
      else {
        var strToUser = '';

        for(var i = 0; i < toUser.length; i++) {
          if(i != 0) {
            strToUser += ',';
          }
          strToUser += toUser.eq(i).data('id');
        }

        var myDate = new Date();
        var hours = myDate.getHours();
        if(hours < 10) {
          hours = '0' + hours;
        }

        var minutes = myDate.getMinutes();
        if(minutes < 10) {
          minutes = '0' + minutes;
        }

        var acctInfo = Global.memoryCache.get('acctInfo');

        var strToUserName = acctInfo.username;

        var obj = $('.js-single-container .date-tips');
        var timestamp = Date.parse(new Date());

        if(obj.eq(obj.length - 1).text() != _(timestamp).toDate()) {
          $('.js-single-container ul').append('<li class="date-tips">' + _(timestamp).toDate() + '</li>');
        }

        $('.js-single-container ul').append('<li class="other"><p>' + strToUserName + ' : ' + hours + ':' + minutes + '</p><i class="iconsImage' + acctInfo.headId + '"></i><div><span>' + self.getFace(content) + '</span><b></b></div></li>');
        $('.js-single-content').val('');
        $('.js-wt-statistics-curt').text(0);


        this.sendChatXhr({
          parentId: $('.js-pf-select-superior').data('id'),
          content: content,
          toUser: strToUser
        })
          .done(function(res) {
            if(res && res.result !== 0) {
              Global.ui.notification.show('系统异常，发送失败');
            }

          });
      }

      if($('.js-single-container').height() > 100) {
        self.$('.js-single-container').scrollTop($('.js-single-container .chat').height() - 240);
      }
    }
  },

  destroy: function() {
    window.clearInterval(this.currentChatTimer);

    Base.ItemView.prototype.destroy.apply(this, arguments);
  }
});

module.exports = InsideLetterView2;