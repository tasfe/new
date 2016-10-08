"use script";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var PlatformNewsPlatformView = require('newsCenter/views/platformNews-platform');
var PlatformNewsDetailView = require('newsCenter/views/platformNewsDetail');
var PlatformNewsSettingView = require('newsCenter/views/platformNewsSetting');

var InsideLetterDetailView = require('newsCenter/views/insideLetterDetail');
var InsideLetterSendView = require('newsCenter/views/insideLetterSend');


var NewsCenterController = RouterController.extend({

  platformNews: function() {
    this.changeMainReginView(new PlatformNewsPlatformView(), {
      main: {
        title: '系统通知',
        titleType: 'nav'
      }
      // sidebar: 'nc'
    });
  },

  platformNewsDetail: function(noticeId) {
    this.changeSubReginView(new PlatformNewsDetailView({
      noticeId: noticeId
    }), {
      main: {
        subReturn: true
      }
      //parentRouter: 'nc/pn'
    });
  },

  platformNewsSetting: function(){
   this.changeMainReginView(new PlatformNewsSettingView(), {
     main: {
       title: '通知设置',
       titleType: 'nav',
       subReturn: true
     },
     parentRouter: 'nc/pn'
   });
  },

  //insideLetter: function() {
  //  this.changeMainReginView(new PlatformNewsView({
  //    triggerTab: 'insideLetter'
  //  }), {
  //    main: {
  //      title: '消息中心'
  //    }
  //  });
  //},

  insideLetterDetail: function(titleId, letterId) {
    this.changeMainReginView(new InsideLetterDetailView({
      titleId: titleId,
      letterId: letterId
    }), {
      main: {
        title: '消息中心',
        subReturn: true
      },
      parentRouter: 'nc/il'
    });
  },

  insideLetterSend: function() {
    this.changeMainReginView(new InsideLetterSendView(), {
      main: {
        title: '发送站内信',
        subReturn: true
      },
      parentRouter: 'nc/il'
    });
  }
});

module.exports = NewsCenterController;
