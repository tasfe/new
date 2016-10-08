"use strict";

var ActiveCenterView = Base.ItemView.extend({

  template: require('activeCenter/templates/activityCenter.html'),

  startOnLoading: true,

  events: {
    'click .js-list-active': 'activityChangeHandler'
  },


  onRender: function () {

    var self = this;
    this.$pagination = this.$('.js-aa-pagination');
    this.$activeContext = this.$('.js-active-context');
    this.$activeHeader = this.$('.js-activeHeader-list');
    this.$type = '';


    this.$pagination.pagination({
      onPaginationChange: function (index) {
        self.renderActiveGrid(index, self.$type);
      }
    });
    this.pagination = this.$pagination.pagination('instance');

    this.renderActiveGrid(0, self.$type);
  },

  getActiveXhr: function (data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getactivitylist.json',
      data: data
    });
  },

  renderActiveGrid: function (pageIndex, type) {
    var self = this;
    this.$activeContext.empty();
    this.getActiveXhr({
      pageSize: 3,
      pageIndex: pageIndex,
      type: this.options.type
    })
      .always(function () {
        self.loadingFinish();
      })
      .done(function (res) {
        var data = res.root || {};
        if (res && res.result === 0) {
          self.pagination.update(data.rowCount, pageIndex);
          self.renderActiveContex(data.activityList);

        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  renderActiveContex: function (activityList) {

    //$('#main').html(this.el);

    if (_(activityList).isEmpty()) {
      this.$activeContext.html(this.getEmptyHtml('暂时没有活动'));
    } else {
      var index = 0;
      var html = [];

      _(activityList).map(function (activity) {
        var badgeClass = '';
        var badgeInner = '';
        switch (activity.bannerStatus) {
          case 0:
            badgeInner = '进行中';
            badgeClass = 'ac-activity-running';
            break;
          case 1:
            badgeInner = '待开始';
            badgeClass = 'ac-activity-coming';
            break;
          case 2:
            badgeInner = '已结束';
            badgeClass = 'ac-activity-end';
            break;
          default:
            badgeInner = '待开始';
            badgeClass = 'ac-activity-coming';
            break;
        }
        var target = activity.bannerUrl || 'javascript:void(0)';
        var leftBanner = '<a href=' + target + ' target="_blank">' +
          '<img class="ac-activity-image" src=' + activity.bannerPicUrl + '/>' +
          '</a>';
        var rightBanner = '<div class="ac-activity-word"><div class="ac-activity-title">' + activity.activityTitle + '</div><div class="activity-badge">' + badgeInner + '</div>' +
          '<div class="ac-activity-des"><div class="ac-activity-time">活动时间：' + _(activity.startTime).toTime('YYYY年MM月DD日') + '&nbsp;至&nbsp;' + _(activity.startTime).toTime('YYYY年MM月DD日') + '</div>' +
          '<div class="ac-activity-time">活动介绍：' + (activity.des || '') + '</div></div></div>';
        var banner = '<div class="at-activity-main"><div class="ac-activity-banner ' + badgeClass + '">' + leftBanner + rightBanner + '</div></div>';

        html.push(banner);
      });
      this.$activeContext.html(html);

    }
  },
  activityChangeHandler: function (e) {

    this.$('.list-active').removeClass('list-active');
    var $target = $(e.currentTarget);
    $target.addClass('list-active');

    var currentIndex = $target.data('index') - 1;

    if (currentIndex < 0) {
      this.renderActiveGrid(0, '');
      this.$type = '';
    } else {
      this.renderActiveGrid(0, currentIndex);
      this.$type = currentIndex;
    }
  },
  getEmptyHtml: function (emptyTip) {
    var html = [];
    if (emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center">');
      html.push('<div class="empty-container-main">');
      html.push('<div class="sfa-grid-empty"></div>');
      html.push(emptyTip);
      html.push('</div>');
      html.push('</div>');
    }

    return html.join('');
  }
});

module.exports = ActiveCenterView;
