"use strict";

require('./index.scss');

var NoticeView = Base.ItemView.extend({

  template: require('./index.html'),

  className: 'hidden',

  events: {
    'click .js-close': 'closeHandler'
  },

  noticeList: [],
  closeStatus: true,

  //count: 0,
  //newNotice: [],
  newNoticeNum: 0,

  getXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getdesktopnotice.json'
    });
  },

  initialize: function() {
    _(this.options || {}).extend({
      spacing: 24,
      total: 0,
      index: 1
    });
  },

  serializeData: function() {
    return this.options;
  },

  onRender: function() {
    var self = this;

    this.$content = this.$('.js-gl-notice-content');
    //this.$pnDown = this.$('.js-wt-pn-down');

    this.handleGetXhr();

    window.setInterval(function() {
      self.handleGetXhr();
    }, 30000);

    //setInterval(function() {
    //  self.$pnDown.trigger('click');
    //}, 5000);

  },

  handleGetXhr: function() {
    var self = this;

    this.getXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.updateNotice(res.root || []);
        }
      });

    //self.updateNotice(self.countDown());
  },

  //countDown: function() {
  //  this.count++;
  //  this.newNotice = [{title: '您有'+ this.count +"个轰动奖励可以领取,<a href='#'>点击领取-></a>"},{title: '您有'+ ++this.count +"个轰动奖励可以领取,<a href='#'>点击领取-></a>"},{title: '您有'+ ++this.count +"个轰动奖励可以领取,<a href='#'>点击领取-></a>"}];
  //  return this.newNotice;
  //},

  updateNotice: function(noticeList) {
    var self = this;

    if (!noticeList.length) {
      noticeList = [];
      return ;
    }

    if (this.closeStatus) {
      this.options.spacing = 24;
      this.$content.html('').css('top', this.options.spacing);
      this.noticeList = noticeList;
      this.$el.removeClass('hidden');
    } else {
      _(noticeList).each(function(notice) {
        self.noticeList.push(notice);
      });
    }

    clearTimeout(this.timer);

    this.closeStatus = false;

    this.options.total = this.noticeList.length;

    //showList = showList.concat(this.noticeList);
    //showList = _(showList.concat(noticeList)).map(function(notice) {
    //  return '<li><div>' + notice.title + '</div></li>';
    //});

    if (this.noticeList.length) {
      this.startRoll();
    }
    //this.$content.html(_(showList).map(function(notice) {
    //  return '<li><div>' + notice.title + '</div></li>';
    //}));

  },

  startRoll: function() {
    if (!this.rollStatus) {
      this.showNextNotice();
    }
  },

  //common APIs
  

  isShow: function() {
    return !!this.$('.js-gl-notice-content').length;
  },

  getNewOne: function() {
    return this.noticeList[0];
  },

  delNewOne: function() {
    this.noticeList.shift();
  },

  showNextNotice: function() {
    var self = this;

    var notice = this.getNewOne();

    if (notice) {
      this.rollStatus = true;

      self.$content.append('<li><div>' + notice.title + '</div></li>');

      this.$content.animate({
        top: self.options.spacing
      }, 2000, function () {
        self.$content.css('top', self.options.spacing);
        self.options.spacing -= 24;
        self.delNewOne();

        //setTimeout(self.showTimer);
        self.showTimer = setTimeout(function() {
          self.showNextNotice();
        }, 3000);
      });

    } else {
      this.rollStatus = false;
      self.timer = setTimeout(function() {
        self._doClose()
      }, 5000);
    }

    if (this.$content.is(':animated')) {
      return false;
    }
  },

  _doClose: function() {
    this.$el.addClass('hidden');
    this.closeStatus = true;
  },

  //event handlers

  closeHandler: function() {
    this._doClose();
    return false;
  }



});

module.exports = NoticeView;
