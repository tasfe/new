"use strict";

var ActiveCenterView = Base.ItemView.extend({

  template: require('activeCenter/templates/activeCenter.html'),

  unitTpl: _(require('activeCenter/templates/activeCenter-unit.html')).template(),

  startOnLoading: true,

  events: {},

  getActiveXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getactivitylist.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;

    //this.$pagination = this.$('.js-aa-pagination');
    this.$adList = this.$('.js-aa-list');

    //this.$pagination.pagination({
    //  onPaginationChange: function(index) {
    //    self.renderActiveGrid(index);
    //  }
    //});

    //this.pagination = this.$pagination.pagination('instance');

    this.renderActiveGrid(0);
  },

  renderActiveGrid: function(pageIndex) {
    var self = this;

    this.$adList.empty();

    this.getActiveXhr({
      pageSize: 20,
      pageIndex: pageIndex
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        var data = res.root || {};
        if (res && res.result === 0) {
          //self.pagination.update(data.rowCount, pageIndex);
          self.renderActive(data.activityList);
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  renderActive: function(activityList) {

    if (_(activityList).isEmpty()) {
      this.$adList.html(this.getEmptyHtml('暂时没有活动'));
    } else {
      this.$adList.html(_(activityList).map(function(activity) {
        var badgeClass = '';
        switch (activity.bannerStatus) {
          case 1:
            break;
          case 0:
            activity.badge = '进行中';
            badgeClass ='';
            break;
          case 2:
            activity.badge = '已结束';
            badgeClass = 'ad-badge-over';
            break;
          default:
            break;
        }

        return this.unitTpl({
          activityId: activity.activityId,
          activityTitle: activity.activityTitle,
          bannerPicUrl: activity.bannerPicUrl,
          bannerStatus: activity.bannerStatus,
          badge: activity.badge,
          badgeClass: badgeClass,
          bannerUrl: activity.bannerUrl||'javascript:void(0);',
          startTime: _(activity.startTime).toDate(),
          endTime: _(activity.endTime).toDate()
        });
      }, this).join(''));
    }
  },

  getEmptyHtml: function(emptyTip) {
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
