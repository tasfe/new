"use strict";

var ActiveCenterView = Base.ItemView.extend({

  template: require('activeCenter/templates/activeCenter.html'),

  startOnLoading: true,

  events: {
    
    
  },
  
  
  onRender: function() {
    this.$activeContext = this.$('.js-active-context');
    this.renderActiveGrid(0);
  },

  getActiveXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getactivitylist.json',
      data: data
    });
  },

  renderActiveGrid: function(pageIndex) {
    var self = this;
    this.$activeContext.empty();
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

          self.renderActiveContex(data.activityList);

          //self.renderActive(data.activityList);

        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  renderActiveContex:function (activityList) {
    if (_(activityList).isEmpty()) {
      this.$activeContext.html(this.getEmptyHtml('暂时没有活动'));
    } else {

      var index = 0;
      var html = [];
      html.push('<div class="active-container-line"></div>');
      _(activityList).map(function(activity) {
        index++;
        var target = activity.bannerUrl||'javascript:void(0)';
        var badgeClass = '';
        var badgeInner = '';

        switch (activity.bannerStatus) {
          case 1:
            break;
          case 0:
            badgeInner = '进行中';
            badgeClass = 'active-badge-running';
            break;
          case 2:
            badgeInner = '已结束';
            badgeClass = 'active-badge-over';
            break;
          default:
            badgeInner = '待开始';
            badgeClass = 'active-badge-comming';
            break;
        }

        var html1 ='<div class="active-list">' +
            '<div>' +
            '<div class="active-left-title">'+activity.activityTitle+'</div>'+
            '<div class='+badgeClass+'>'+badgeInner+'</div>'+
            '</div>'+
            '<div class="active-round-dot">'+index+'</div>'+
            '<div class="active-right-content">' +
            '<a href='+target+' target="_blank">' +
            '<img class="active-right-image" src='+activity.bannerPicUrl+'/>'+
            '<div class="active-right-time">【活动时间】'+_(activity.startTime).toDate()+'至'+_(activity.endTime).toDate()+'</div>'+
            '</a>'+
            '</div>'+
            '</div>';
        html.push(html1);
      });
      this.$activeContext.html(html);

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
