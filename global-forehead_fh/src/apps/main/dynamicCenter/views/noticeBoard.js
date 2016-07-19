"use strict";

var FilterHelper = require('skeleton/misc/filterHelper');

var NoticeBoardView = Base.ItemView.extend({

  template: '<div class="js-nc-board nc-board"></div>',

  startOnLoading: true,

  itemTpl: _(require('dynamicCenter/templates/noticeBoard-item.html')).template(),

  className: 'nc-noticeBoard',

  events: {},

  getXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data: data
    });
  },

  onRender: function () {
    this.$grid = this.$('.js-nc-board');

    this.renderNoticeGrid(0);
  },

  renderNoticeGrid: function(pageIndex) {
    var self = this;

    this.getXhr({
      pageSize: 20,
      pageIndex: pageIndex
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        var data = res.root || {};
        if (res && res.result === 0) {
          self.renderGrid(data.buList);
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  renderGrid: function(rowList) {

    if (_.isEmpty(rowList)) {
      this.$grid.html(this.getEmptyHtml('暂时没有动态'));
    } else {
      this.$grid.html(_(rowList).map(function(rowInfo) {
        var date = new Date(rowInfo.time);

        return this.itemTpl({
          title: rowInfo.title,
          date: date.getFullYear() + '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-' + (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds()),
          url: _.getUrl('/detail/' + rowInfo.bulletionId),
          desc: rowInfo.desc
        });
      }, this));
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

module.exports = NoticeBoardView;
