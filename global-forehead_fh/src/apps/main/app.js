"use strict";

var HeaderView = require('skeleton/bases/header');
var NavbarView = require('skeleton/bases/navbar');
var RechargeView = require('fundCenter/views/recharge');
var DesktopNewsView = require('skeleton/bases/desktopNews');
var InsideLetterView = require('skeleton/bases/insideLetter2');
var EntryView = require('skeleton/bases/entry');
var FooterView = require('com/footer');
var NoticeBoardView = require('dynamicCenter/views/noticeBoardFH');

// var RainActivity = require('com/rainActivity');

var FirstLoginUpdatePasswd = require('com/firstLoginUpdatePasswd');

var EntryModel = require('skeleton/models/entry');
var NewsModel = require('skeleton/models/news');

var App = new window.Base.Application();

App.on('start', function() {
  $('body').addClass('loaded').find('.wm-loader-wrapper').remove();
  $('.js-wrapper').removeClass('hide');
});

App.addRegions({
  headerRegion: '#header',
  navbarRegion: '#navbar',
  mainRegin: '#main',
  entryRegion: '#quickEntry',
  subMainRegin: '#subMain',
  topRegin: '#topProfile',
  // newbieRegin: '#newbie',
  insideLetterRegion: '#insideLetter',
  desktopNewsRegion: '#desktopNews',
  footerRegin: '#footer'
});

App.addInitializer(function(options) {

  App.headerRegion.show(new HeaderView());

  App.navbarRegion.show(new NavbarView());

  var entryModel = Global.data.set('entryModel', new EntryModel());

  var newsModel = Global.data.set('newsModel', new NewsModel());

  App.entryRegion.show(new EntryView({
    model: entryModel
  }));

  App.insideLetterRegion.show(new InsideLetterView());

  App.desktopNewsRegion.show(new DesktopNewsView());

  // $('body').append(new RainActivity().render().$el);

  App.footerRegin.show(new FooterView({
    signed: true
  }));

  Backbone.history.start();

  _bindNoticeHandler();
  _bindLetterHandler();
  _bindRechargeHandler();
  _bindServiceHandler();
  _bindClosePopoverHandler();
  _bindClickFeedbackHandler();

  this.firstLoginUpdatePasswd = new FirstLoginUpdatePasswd();
  this.firstLoginUpdatePasswd.checkState(function(state) {
    if(state !== 1 && !Global.cookieCache.get('hasLoadBulletin')){
      Global.cookieCache.set('hasLoadBulletin', true);
      $('.js-gl-notice').trigger('click');
    }
  });
});

function _bindNoticeHandler() {
  $(document).off('click.notice').on('click.notice', '.js-gl-notice', function(e) {
    var noticeBoardView;

    var $dialog = Global.ui.dialog.show({
      title: '平台公告',
      size: '',
      body: '<div class="js-head-bulletin-container"></div>',
      bodyClass: 'no-padding',
      modalClass: 'header-bulletin-dialog',
      footer: ''
    });

    var $bulletinContainer = $dialog.find('.js-head-bulletin-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      noticeBoardView.destroy();
    });

    noticeBoardView = new NoticeBoardView({
      el: $bulletinContainer,
      reqData: {
       bulletinId: $(e.currentTarget).data('bulletin-id')
      }
    }).render();
  });
}


function _bindLetterHandler() {
  $(document).off('click.letter').on('click.letter', '.js-gl-letter', function(e) {
    var $target = $(e.currentTarget);

    var insideLetterView;

    var $dialog = Global.ui.dialog.show({
      title: '对话列表',
      size: 'modal-info-julien',
      body: '<div class="js-nc-insideLetter"></div><div class="gl-loading js-julien-loading julien-loading-leftmenu"><div class="gl-loading-main"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>',
      bodyClass: 'no-padding',
      footer: ''
    });

    var $letterContainer = $dialog.find('.js-nc-insideLetter');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      insideLetterView.destroy();
    });

    insideLetterView = new InsideLetterView({
      el: $letterContainer,
      reqData: {
        userId: $target.data('userId'),
        name: $target.data('name')
      }
    }).render();

    sessionStorage.setItem('openMessage', 1);
  });
}

function _bindRechargeHandler() {
  var self = this;
  $(document).off('click.reDialog').on('click.reDialog', '.js-fc-re', function(e) {

    var acctInfo = Global.memoryCache.get('acctInfo');
    if (!acctInfo || acctInfo.userStatus === 100) {
      // alert('用户已被冻结，无法进行充值操作。');
      Global.ui.notification.show('用户已被冻结，无法进行充值操作。');
      return false;
    }

    //设置了则弹出验证框
    var rechargeView = new RechargeView({parentView: self});

    var $dialogRe = Global.ui.dialog.show({
      id: _.now(),
      title: '充值',
      size: ' ',
      modalClass: 'fc-re-modal',
      bodyClass: 'js-fc-re-modal',
      body: '<div class="js-fc-re-container"></div>'
    });

    $dialogRe.find('.js-fc-re-container').html(rechargeView.render().el);

    $dialogRe.on('hidden.modal', function (e) {
      $(this).remove();
      rechargeView.destroy();
    });
  });
}

function _bindServiceHandler() {
  $(document).off('click.service').on('click.service', '.js-gl-service', function(e) {
     var newwin = window.open(
       // 'http://chat.live800.com/live800/chatClient/staticButton.js?companyID=731101&configID=2579&jid=4521278370',
       'http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370',
       'service',
       'width=800,height=680'
     );
    newwin.moveTo(100,50);
  });
}

function _bindClosePopoverHandler() {
  $(document).off('click.popover').on('click.popover', '.popover', function(e) {
    var $target = $(e.target);
    var $popover = $target.closest('.popover');
    if (!$popover.length) {
      _($(':data(popover)')).each(function(el) {
        var $el = $(el);
        if ($el.data('popover') !== $target.data('popover') &&
          $el.data('popover') && $el.data('popover').$tip && $el.data('popover').$tip.hasClass('in')) {
          $el.popover('hide');
        }
      });
    }
  });
}

function _bindClickFeedbackHandler() {
  $(document).off('click.clickFeedback', '.cbutton').on('click.clickFeedback', '.cbutton', function(e) {
    var $target = $(e.currentTarget);
    $target.addClass('cbutton--click');
    onEndAnimation($target.hasClass('cbutton--complex') ? $target.find('.cbutton__helper') : $target, function() {
      $target.removeClass('cbutton--click');
    });
  });
}

var support = {
  animations: window.Modernizr.cssanimations
  },
  animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
  animEndEventName = animEndEventNames[window.Modernizr.prefixed('animation')];

function onEndAnimation($el, callback) {
  var onEndCallbackFn = function(ev) {
    if(support.animations) {
      if(ev.target !== this) {
        return;
      }
      this.removeEventListener(animEndEventName, onEndCallbackFn);
    }
    if(callback && typeof callback === 'function') {
      callback.call();
    }
  };
  if(support.animations) {
    $el.on(animEndEventName, onEndCallbackFn);
  } else {
    onEndCallbackFn();
  }
}

module.exports = App;
