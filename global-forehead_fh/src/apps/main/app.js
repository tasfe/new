"use strict";

var HeaderView = require('skeleton/bases/header');
var NavbarView = require('skeleton/bases/navbar');
var RechargeView = require('fundCenter/views/recharge');
var DesktopNewsView = require('skeleton/bases/desktopNews');
var EntryView = require('skeleton/bases/entry');
//活动快捷入口
var ActivityEntryView = require('skeleton/bases/activityEntry');
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
  // 活动快捷入口
  activityEntryRegion: '#activityEntry',
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

  //活动快捷入口。
  App.activityEntryRegion.show(new ActivityEntryView({}));

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

  //关闭浏览器时，sessionStorage丢失，导致无法正确判断用户状态
  var actInfo = Global.memoryCache.get('acctInfo');
  var status = Number(actInfo.userStatus);
  if(status===103 || status===104 || status===105 || status===106){
    sessionStorage.status = 1;
  }
  //
  this.firstLoginUpdatePasswd = new FirstLoginUpdatePasswd();
  this.firstLoginUpdatePasswd.on('close', function() {
    if(!Global.sessionCache.get('hasLoadBulletin')) {
      Global.sessionCache.set('hasLoadBulletin', true);
      openNotice();
    }
  });
  this.firstLoginUpdatePasswd.checkState(function(state) {
    if(state !== 1 && !Global.sessionCache.get('hasLoadBulletin')){
      Global.sessionCache.set('hasLoadBulletin', true);
      openNotice();
    }
  });
});

function _bindNoticeHandler() {
  $(document).off('click.notice').on('click.notice', '.js-gl-notice', function(e) {
    openNotice($(e.currentTarget).data('bulletin-id'));
  });
}

function openNotice(id) {
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
      bulletinId: id
    }
  }).render();
}


function _bindLetterHandler() {
  $(document).off('click.letter').on('click.letter', '.js-gl-letter', function(e) {
    var $target = $(e.currentTarget);
    Global.ui.insideLetter.openChat($target.data('userId'), $target.data('name'));
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
    var acctInfo = Global.memoryCache.get('acctInfo');
    var nickName = acctInfo.username;
     var newwin = window.open(
       'http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370&info=' + encodeURIComponent('userId=' + acctInfo.userId + '&name=' + nickName),
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

  // $(document).on('[data-toggle=popover]').on("hide", function (e) {
  // });
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
