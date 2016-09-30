"use strict";

var NoticeDetailView = require('dynamicCenter/views/noticeDetailFH');

var NoticeBoardView = Base.ItemView.extend({

  template: require('dynamicCenter/templates/noticeBoardFH.html'),

  startOnLoading: true,

  dynamicTpl: _(require('dynamicCenter/templates/noticeBoardFH-item.html')).template(),

  className: 'nc-noticeBoard',

  options: {
    pageSize: 20
  },

  events: {
    'click .js-header-bulletin-item': 'checkNoticeDetailHandler',
    'click .js-head-bulletin-prev': 'prevPageHandler',
    'click .js-head-bulletin-next': 'nextPageHandler',
  },

  //获取平台动态
  getDynamicXhr: function(data) {
    if (this.outSide) {
      return Global.sync.ajax({
        url: '/info/activitylist/publist.json',
        data: data
      });
    } else {
      return Global.sync.ajax({
        url: '/info/activitylist/getbulletinlist.json',
        data: data
      });
    }

  },

  onRender: function () {
    var self = this;

    this.$dynamicList = this.$('.js-head-bulletin-list');
    this.$pageSize = this.$('.js-head-bulletin-pageSize');
    this.$pageIndex = this.$('.js-head-bulletin-pageIndex');
    this.$rowCount = this.$('.js-head-bulletin-rowCount');
    this.$prevPage = this.$('.js-head-bulletin-prev');
    this.$nextPage = this.$('.js-head-bulletin-next');

    this.$DetailContainer = this.$('.js-head-bulletin-content');

    var data = {
      pageSize: 7,
      pageIndex: 0
    };
    this.bulletinId = this.options.reqData.bulletinId;
    this.outSide = this.options.reqData.packages;

    if(this.bulletinId){
      _(data).extend({bulletionId:this.bulletinId});
    }
    this.renderDynamicList(data);


  },

  renderDynamicList: function(data) {
    var self = this;
    this.getDynamicXhr(data)
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res.result === 0) {
          self.generateDynamicList(res.root);
          var data = res.root;
          self.$pageIndex.val(data.pageIndex);
          if(data.pageIndex===0){
            self.$prevPage.addClass('trun-page-disabled');
          }else{
            self.$prevPage.removeClass('trun-page-disabled');
          }
          self.$rowCount.val(res.root.rowCount);
          self.$prevPage.toggleClass('disabled', data.pageIndex < 1);

          var pageSize = Number(self.$pageSize.val());
          var rowCount = Number(res.root.rowCount);
          if (_(pageSize).isNumber() && _(pageSize).isFinite() && _(rowCount).isNumber() && _(rowCount).isFinite()) {
            if (data.pageIndex >= Math.ceil(rowCount / pageSize) - 1) {
              self.$nextPage.addClass('trun-page-disabled');
            } else {
              self.$nextPage.removeClass('trun-page-disabled');
            }
          }

          if(self.bulletinId){
            self.$('.js-header-bulletin-item[data-id="'+self.bulletinId+'"]').trigger('click');
          } else {
            var bulletinList = self.$('.js-header-bulletin-item');
            $(bulletinList[0]).trigger('click', {notRead: true});
          }
        }
      });
  },

  generateDynamicList: function(data) {
    this.$dynamicList.html(_(data.buList).map(function(item) {
      var date = moment(item.time).format('MM-DD');

      return this.dynamicTpl({
        date: date,
        read: item.read,
        desc: item.desc,
        title: item.title,
        bulletinId: item.bulletionId
      });
    }, this).join(''));
  },

  prevPageHandler: function() {
    var pageIndex = this.$pageIndex.val();
    if (pageIndex === '0') {
      return false;
    }

    var data = {pageSize: this.$pageSize.val(), pageIndex: pageIndex - 1};

    this.renderDynamicList(data);
  },

  nextPageHandler: function() {
    var pageIndex = Number(this.$pageIndex.val());
    var pageSize = Number(this.$pageSize.val());
    var rowCount = Number(this.$rowCount.val());

    if (_(pageSize).isNumber() && _(pageSize).isFinite() && _(rowCount).isNumber() && _(rowCount).isFinite()) {
      if (pageIndex === Math.ceil(rowCount / pageSize) - 1) {
        return false;
      } else {
        var data = {
          pageSize: pageSize,
          pageIndex: pageIndex + 1
        };

        this.renderDynamicList(data);
      }
    }
  },

  onDestroy: function() {
    //Global.navbarRegin.currentView.showScroll();
    //Global.entryRegin.currentView.show();
  },
  checkNoticeDetailHandler: function(e, opt){
    var $target = $(e.currentTarget);
    var $title = $target.find('.js-header-bulletin-list-title');
    var $flag = $target.find('.js-header-bulletin-list-read-flag');

    $title.removeClass('header-bulletin-list-title-false');
    $title.addClass('header-bulletin-list-title-true');
    if (this.outSide) {
      this.$('.js-header-bulletin-list-read-flag').remove();
    } else {
      if (_.isEmpty(opt)) {
        $flag.removeClass('header-bulletin-list-read-flag-false');
        $flag.addClass('header-bulletin-list-read-flag-true');
        $flag.html('已读');
      }
    }
    var id = $(e.currentTarget).data('id');
    this.showNoticeDetail(id);
  },
  showNoticeDetail: function(id){
    var noticeDetailView = new NoticeDetailView({noticeId:id, outside: this.outSide});
    this.$DetailContainer.html(noticeDetailView.render().el);
  }
});

module.exports = NoticeBoardView;
