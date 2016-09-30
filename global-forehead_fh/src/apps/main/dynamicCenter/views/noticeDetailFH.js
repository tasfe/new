"use strict";

var NoticeDetailView = Base.ItemView.extend({

  template: require('dynamicCenter/templates/noticeDetailFH.html'),

  //bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  startOnLoading: true,

  className: 'nc-noticeDetail',

  events: {},

  getAdXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getactivityadvertise.json',
      data: {
        pageSize: 1
      }
    });
  },

  onRender: function() {
    var self = this;

    this._getNoticeDetailXhr();
  },

  _getNoticeDetailXhr: function() {
    var self = this;
    if (this.options.outside) {
      var url = '/info/activitylist/pubdetail.json'
    } else {
      var url = '/info/activitylist/userGetbulletindetail.json'
    }

    Global.sync.ajax({
      url: url,
      data: {
        bulletinId: this.options.noticeId
      }
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          //self.renderGrid(res.root, res);
          self.$('.js-nc-noticeDetailTitle').html(res.root.title);
          self.$('.js-nc-noticeDetailDate').html(_(res.root.time).toTime());
          self.$('.js-nc-noticeDetailContext').html(res.root.content);
        } else {
          Global.ui.notification.show('通知详情获取失败');
        }
      });

    return this;
  }

});

module.exports = NoticeDetailView;
