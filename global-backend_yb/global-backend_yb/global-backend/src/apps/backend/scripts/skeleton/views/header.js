define(function(require, exports, module) {

  var headerTemplate = require('text!skeleton/templates/header.html');

  var HeaderView = Base.ItemView.extend({

    template: headerTemplate,

    noticeTpl: _(require('text!skeleton/templates/notice.html')).template(),

    events: {
      'click #sidebarToggleLG': 'toggleSidebar',
      'click #sidebarToggleSM': 'toggleSidebarFromSM',
      'click .js-gl-notice-item': 'noticeReadHandler',
      'click .js-gl-hd-logout': 'logoutHandler'
    },

    onRender: function() {
      var self = this;

      this.$noticeNum = this.$('.js-gl-notice-num');
      this.$noticeMain = this.$('.js-gl-notic-main');


      this.model = Global.data.get('noticeModel');

      this.listenTo(this.model, 'change:list', this.renderNotice);

      this.subscribe('acct', 'acct:updating', function() {
        self.renderAcctInfo();
      });

      this.subscribe('notice', 'notice:updating', function() {
        self.renderNotice();
      });
    },

    renderAcctInfo: function() {
      var acctInfo = Global.memoryCache.get('acctInfo');

      this.$('.js-gl-hd-nickName').html(acctInfo.uName || acctInfo.username);
    },

    renderNotice: function() {

      var info = this.model.pick('list', 'hasNew', 'newList');

      this.$noticeNum.text(info.list.length).toggleClass('active', info.list.length !== 0);

      this.$noticeMain.html(this.noticeTpl({
        list: info.list
      }));

      if (info.hasNew) {
        this.model.set('hasNew', false);

        Global.audio.add(_(info.newList).pluck('audio'));
      }
    },

    toggleSidebar: function(e) {
      if ($('.wrapper').hasClass('display-right')) {
        $('.wrapper').removeClass('display-right');
        $('.sidebar-right').removeClass('active');
      } else {
        $('.top-nav').toggleClass('sidebar-mini');
        $('.sidebar-menu').toggleClass('sidebar-mini');
        $('footer').toggleClass('sidebar-mini');
        $('.main-container').toggleClass('sidebar-mini');

        $('.main-menu').find('.openable').removeClass('open');
        $('.main-menu').find('.submenu').removeAttr('style');

      }
      return false;
    },

    //event handlers

    noticeReadHandler: function(e) {
      var $target = $(e.currentTarget);

      this.model.read($target.data('id'));
    },

    toggleSidebarFromSM: function(e) {
      $('.sidebar-menu').toggleClass('active');
      $('.wrapper').toggleClass('display-left');
    },

    logoutHandler: function(e) {
      Global.ui.loader.show();

      Global.oauth.logout().done(function(data) {
        if (data && data.result === 0) {
          setTimeout(function() {
            window.location.href = 'login.html';
          }, 300);
        }
      }).always(function() {
        Global.ui.loader.hide();
      });
      
      return false;
    }

  });

  module.exports = HeaderView;

});