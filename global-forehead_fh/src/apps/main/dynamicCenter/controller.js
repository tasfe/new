"use script";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var NoticeBoardView = require('dynamicCenter/views/noticeBoard');
var NoticeDetailView = require('dynamicCenter/views/noticeDetail');

var DynamicCenterController = RouterController.extend({

  noticeBoard: function(){
    this.changeMainReginView(new NoticeBoardView(), {
      main: {
        title: '平台动态'
      },
      sidebar: Global.ui.menu.get(['ac', 'uc', 'aa'])
    });
  },

  noticeDetail: function(noticeId){
    this.changeSubReginView(new NoticeDetailView({
      noticeId:noticeId
    }), {
      main: {
        subReturn: true
      },
      needParent: false,
      sidebar: Global.ui.menu.get(['ac', 'uc', 'aa']),
      parentRouter: 'nc/nb'
    });
  }

});

module.exports = DynamicCenterController;
