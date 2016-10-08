"use strict";

var TabView = require('com/tabView');

var PlatformView = require('newsCenter/views/platformNews-platform');
var PlatformSettingView = require('newsCenter/views/platformNewsSetting');

var PlatformNewsView = TabView.extend({

  events: {},

  initialize: function () {
    _(this.options).extend({
      tabs: [
        {
          label: '消息中心',
          name: 'platform',
          id: 'jsNcPlatform',
          // router: 'nc/pn',
          view: PlatformView
        },
        {
          label: '通知设置',
          name: 'platformSetting',
          id: 'jsNcPlatformSetting',
          class: 'hidden',
          // router: 'nc/il',
          view: PlatformSettingView
        }
      ]
    });

    // _.bindAll(this, 'renderUnread');
  },

  onRender: function() {
    TabView.prototype.onRender.apply(this, arguments);

    this.$unReadNotice = this.$('.js-nc-noticeTab-unRead');
    this.$unReadLetter = this.$('.js-nc-letterTab-unRead');
    this.$('.js-view-tabs li:not(.active)').addClass('hidden');

    // this.subscribe('news', 'news:updating', this.renderUnread);
  },

  renderUnread: function(model) {
    var unReadNotice = model.get('unReadNotice');
    var unReadLetter = model.get('unReadLetter');
    if (unReadNotice === 0) {
      this.$unReadNotice.closest('.js-nc-unRead-main').addClass('hidden');
    } else {
      this.$unReadNotice.closest('.js-nc-unRead-main').removeClass('hidden');
    }
    this.$unReadNotice.text(unReadNotice);

    if (unReadLetter === 0) {
      this.$unReadLetter.closest('.js-nc-unRead-main').addClass('hidden');
    } else {
      this.$unReadLetter.closest('.js-nc-unRead-main').removeClass('hidden');
    }

    this.$unReadLetter.text(unReadLetter);
  }
});

module.exports = PlatformNewsView;
