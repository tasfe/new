"use strict";

var bannerConfig = require('dynamicCenter/misc/bannerConfig');

var NoticeDetailView = Base.ItemView.extend({

  template: require('dynamicCenter/templates/noticeDetail.html'),

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
    //this.$ad = this.$('.js-nc-ad');
    //this.$ol = this.$('.js-nc-ol');

    this._getNoticeDetailXhr();

    //this.getAdXhr()
    //  .done(function(res) {
    //    var data;
    //    if (res && res.result === 0) {
    //      data = res.root ? res.root : bannerConfig;
    //
    //      self.$ad.html(self.bannerTpl({
    //        data: data
    //      }));
    //
    //      self.$ol.html(_(data).map(function(info, index) {
    //        return '<li data-target="#jsCarousel" data-slide-to="' + index + '" ' +
    //          (index ? '' : 'class="active"') + '></li>';
    //      }).join(''));
    //    }
    //  });
  },

  _getNoticeDetailXhr: function() {
    var self = this;

    Global.sync.ajax({
      url: '/info/activitylist/userGetbulletindetail.json',
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
