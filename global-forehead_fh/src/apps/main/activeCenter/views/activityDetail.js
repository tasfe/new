/**
 * Created by XiaMi on 2016/10/8.
 */
"use strict";

var ActivityDetailView = Base.ItemView.extend({

  template: require('activeCenter/templates/activityDetail.html'),

  startOnLoading: true,

  className: 'at-activityDetail',

  events: {},

  initialize: function () {
  },

  onRender: function() {
    var self = this;
    this.$title = this.$('.js-atd-title');
    this.$time = this.$('.js-atd-time');
    this.$content = this.$('.js-atd-content');
    
    this.getDetailXhr({
        activityId:this.options.activityId
      })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res.result === 0 && res.root) {
          self._renderDetail(res.root);
        } else {
          Global.ui.notification.show('获取活动详情失败：' + res.msg);
        }
      });
  },

  getDetailXhr: function(data){
    return Global.sync.ajax({
      url: '/info/activitylist/activitydetail.json',
      data: data
    });
  },

  _renderDetail: function (detail) {
    this.$title.html('主题：' + detail.activityTitle);
    this.$time.html('时间：' + _(detail.startTime).toTime('YYYY-MM-DD HH:mm:SS') + ' 至 ' + _(detail.endTime).toTime('YYYY-MM-DD HH:mm:SS'));
    this.$content.html(detail.content);
  }

});

module.exports = ActivityDetailView;
