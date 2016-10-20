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
  newNoticeNum: 0,

  getXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getdesktopnotice.json'
    });
  },

  initialize: function() {
    _(this.options || {}).extend({
      spacing: 500,
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
    this.handleGetXhr();

    window.setInterval(function() {
      self.handleGetXhr();
    }, 30000);

  },

  handleGetXhr: function() {
    var self = this;
    this.getXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.updateNotice(res.root || []);
        }
      });
  },

  updateNotice: function(noticeList) {
    var self = this;
    if (!noticeList.length) {
      noticeList = [];
      return ;
    }

    if (this.closeStatus) {
      this.options.spacing = 500;
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

    if (this.noticeList.length) {
      this.startRoll();
    }

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

      self.$content.append('<li><div class="slideIn"><a class="js-close close-notice pull-right" data-dismiss="alert" href="#">X</a><div class="notice-title text-hot">' + notice.title + '</div></div></li>');

      this.$content.animate({
        top: self.options.spacing
      }, 1000, function () {
        self.$content.css('top', self.options.spacing);
        self.options.spacing -= 100;
        self.delNewOne();
        //setTimeout(self.showTimer);
        self.$content.find('div.slideIn').last().addClass('showing');
        console.log(self.options.spacing );
        self.showTimer = setTimeout(function() {
          self.showNextNotice();
          self.$content.find('div.slideIn.showing').first().removeClass('slideIn').addClass('fadeOut');
        }, 1500);
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
  //closeHandler: function() {
  //  this._doClose();
  //  return false;
  //}

  closeHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.closest('li').remove();
    this.options.spacing += 100;
    return false;
  }

});

module.exports = NoticeView;
