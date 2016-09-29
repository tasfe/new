"use strict";

require('./index.scss');

var EntrySettingView = require('../entrySetting/index');

var BettingCenterView = require('bettingCenter/views/bettingCenter');
var MMCBettingCenterView = require('bettingCenter/mmc');
var SMMCBettingCenterView = require('bettingCenter/smmc');

var FirstLoginUpdatePasswd = require('com/firstLoginUpdatePasswd');

var Countdown = require('com/countdown');

var ticketConfig = require('skeleton/misc/ticketConfig');



var EntryView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-gl-ticket-entry': 'selectTicketHandler',
    'click .js-gl-entry-item': 'entryClickHandler',
    'mouseover .js-qe-setting': 'inSettingHandler',
    'mouseout .js-qe-setting': 'outSettingHandler',
    'click .js-qe-setting': 'openSettingHandler'
  },

  serializeData: function() {
    return {
      ticketList: ticketConfig.getCompleteAll()
    };
  },

  initialize: function() {
    this.listenTo(this.model, 'change:entry', this.renderSetting);

    this.model.fetch()
      .done(function(res) {
        if (res && res.result !== 0) {
          Global.ui.notification.show('获取快捷入口设置失败');
        }
      });

    _.bindAll(this, 'renderUpdateUnread');

    this.subscribe('message', 'message:updating', this.renderUpdateUnread);

    sessionStorage.setItem('openMessage', 0);
  },
  
  onRender: function() {
    this.$entryGroup = this.$('.js-gl-entry-group');
    this.$unRead = this.$('.js-gl-letter-unread');

    this.$entryGroup.sortable();
    this.$entryGroup.disableSelection();

    this.$('.js-gl-ticket-menu').dropMenu();

    this.firstLoginUpdatePasswd = new FirstLoginUpdatePasswd();
    this.firstLoginUpdatePasswd.checkState();

    document.onkeydown = function(e) {  
    //捕捉回车事件  
    var ev = (typeof event!= 'undefined') ? window.event : e;  
        if(ev.keyCode == 13) {

          if ($('#adsf123').html() != undefined) {
            $('.confirm-agree').click();
          }
        }  
    }  

    var strHash = document.location.hash;
    if (strHash=='') {
      $('.head > ul > li').eq(6).addClass('sd');
      $('.js-rightMenu').addClass('hidden');
    }
    else{
      $('.js-rightMenu').removeClass('hidden');
    }
    if ( strHash.slice(0,6) == '#bc/20' ) {
      $('body').addClass('mmc');
    }
    else{
      $('body').removeClass('mmc');
    }
    
    var strType = strHash.slice(0,3);
    if ( strHash.slice(0,6) == '#bc/18' ) {
      $('body').addClass('pk10');
    }
    else{
      $('body').removeClass('pk10');
    }

    if (strType == '#ac' || strType == '#uc') {
      if ( strType == '#uc' ) {
        var strType2 = strHash.slice(4);
        if (strType2 == 'rr' || strType2 == 'wr' || strType2 == 'ad' || strType2 == 'br' || strType2 == 'tr' || strType2 == 'rm' || strType2 == 'bac') {
           $('.js-publicTeamData').removeClass('hidden');
        }
        else{
          $('.js-publicTeamData').addClass('hidden');
        }
      }
      else{
        $('.js-publicTeamData').removeClass('hidden');
      }
    }
    else{
      $('.js-publicTeamData').addClass('hidden');
    }

    if (strHash=='' || strHash.slice(1) == 'gc') {
      $('body').addClass('hidden-js-main-display2');
    }
    else{
      $('body').removeClass('hidden-js-main-display2');
    }

    window.onhashchange = function () {
      var strHash = document.location.hash;

      if ( strHash.slice(0,6) == '#bc/18' ) {
        $('body').addClass('pk10');
      }
      else{
        $('body').removeClass('pk10');
      }

      if (strHash=='') {
        $('.js-rightMenu').addClass('hidden');
      }
      else{
        $('.js-rightMenu').removeClass('hidden');
      }

      if ( strHash.slice(0,3) == '#bc' ) {
        $('.js-menuLeft2').removeClass('hidden');
        $('.js-menuLeftBtn').removeClass('hidden');
        if( $(window).width() < 1574 ){
          var w = $(window).width() / 2 - 600;
          if (w < 0) {
            w = 0;
          }
          else{
            w -= 18;
          }
          w *= -1;
          $('.js-menuLeft').css('left',w);
        }
      }
      else{
        $('.js-menuLeft2').addClass('hidden').removeClass('menuLeftOpen');
        $('.js-menuLeftBtn').addClass('hidden').removeClass('menuLeftBtnShow');
      }

      if(sessionStorage.getItem('opacity') == 1){
        sessionStorage.setItem('opacity',0);
      }
      else{
        sessionStorage.setItem('opacity',1);
        $('.global-main').css('opacity',0);
        $('.global-main').animate({opacity: 1}, 1000);
      }

      var strType = strHash.slice(0,3);
      if (strType == '#ac' || strType == '#uc') {
        if ( strType == '#uc' ) {
          var strType2 = strHash.slice(4);
          if (strType2 == 'rr' || strType2 == 'wr' || strType2 == 'ad' || strType2 == 'br' || strType2 == 'tr' || strType2 == 'rm' || strType2 == 'bac') {
             $('.js-publicTeamData').removeClass('hidden');
          }
          else{
            $('.js-publicTeamData').addClass('hidden');
          }
        }
        else{
          $('.js-publicTeamData').removeClass('hidden');
        }
      }
      else{
        $('.js-publicTeamData').addClass('hidden');
      }

      if (strHash=='' || strHash.slice(1) == 'gc') {
        $('body').addClass('hidden-js-main-display2');
      }
      else{
        $('body').removeClass('hidden-js-main-display2');
      }

      if ( strHash.slice(0,6) == '#bc/20' ) {
        $('body').addClass('mmc');
      }
      else{
        $('body').removeClass('mmc');
      }

      if (strHash.slice(0,6) == '#bc/20' || strHash.slice(0,6) == '#bc/19') {
        $('body').removeClass('footerShow');
      }
      else{
        $('body').addClass('footerShow');
      }
    };


    var w = 0;
    var w2 = 0;
    var w3 = 1130;
    setTimeout(function(){
      w = $('.db-slogan .g2 a').width();
      w2 = w;

      self.timer22 = setInterval(function() {
        if(w2 + w <= 0){
          w2 = w3;
        }
        else{
          w2 -= 1;
        }
        
        $('.db-slogan .g2 a').css('left',w2);
      }, 20);
    }, 1000);
  },

  renderSetting: function() {
    var self = this;
    var entryList = this.model.getEntryList();

    this.clear();

    this.$entryGroup.prepend(_(entryList).map(function(entry) {
      var entryInfo;

      var $entry = self.$entryGroup.find('.router').filter('[href="#' + entry.router + '"]');

      //快捷入口不存在
      if (!$entry.length) {
        entry.entryType = 'quick';
        entryInfo = self._initEntry(entry);

        if (entryInfo.view) {
          Global.viewPool.quickPush({
            regin: Global.mainRegin,
            initId: entry.initId,
            name: entry.name,
            router: entry.router,
            type: entry.type,
            $entry: entryInfo.$entry,
            view: entryInfo.view
          });
        }

        return entryInfo.$entry;
      } else {
        $entry.removeClass('js-gl-not-quick-entry-item');
        return $entry;
      }
    }));

    this.updateQuickEntry(window.location.hash);
  },

  _initEntry: function(entry) {
    var html = [];
    var $entry;

    entry.initId = Number(entry.initId);
    entry.router = entry.router === '#' ? '' : entry.router;

    html.push('<a class="js-gl-entry-item ');
    if (entry.entryType !== 'quick') {
      html.push('js-gl-not-quick-entry-item ');
    }
    html.push('router js-gl-entry-item-' + entry.initId + '" data-id="' + entry.initId + '" href="#' + entry.router + '">');
    html.push('<div class="quick-item">');

    var extraCSS = '';

    html.push('<div class="quick-title ' + extraCSS + '">');

    //if (entry.icon) {
    //  if (entry.iconType === 'sfa') {
    //    html.push('<span class="fa-stack m-right-sm text-center">');
    //    html.push('<i class="fa fa-circle fa-stack-2x ' + entry.backStyle + '"></i>');
    //    html.push('<i class="sfa sfa-sidebar-' + entry.icon + ' text-light"></i>');
    //    html.push('</span>');
    //  } else {
    //    html.push('<span class="fa-stack m-right-sm">');
    //    html.push('<i class="fa fa-circle fa-stack-2x ' + entry.backStyle + '"></i>');
    //    html.push('<i class="fa fa-stack-1x fa-' + entry.icon + ' text-light"></i>');
    //    html.push('</span>');
    //  }
    //}

    html.push(entry.name);

    //if (entry.type === 'ticket') {
    //  html.push(' <span class="js-gl-countdown"></span>');
    //}

    html.push('</div>');

    html.push('</div>');
    html.push('</a>');

    $entry = $(html.join(''));

    var ticketView;
    if (entry.type === 'ticket') {
      //当前页正是快捷入口时，直接加入quickPool中
      if (Global.viewPool._polling.length && Global.viewPool._polling[0].router === entry.router) {
        ticketView = Global.viewPool._polling[0].view;
      } else {

        if(Number(entry.id)===20){
          ticketView = new SMMCBettingCenterView({
            ticketId: Number(entry.id)
          });
          ticketView = undefined;
        }else if(Number(entry.id)===19){
          ticketView = new MMCBettingCenterView({
            ticketId: Number(entry.id)
          });
          ticketView = undefined;
        }else{
          ticketView = new BettingCenterView({
            ticketId: Number(entry.id)
          }).render();
        }

      }
      if(Number(entry.id)!==19 && Number(entry.id)!==20) {
        ticketView.on('change:leftTime', function(leftTime, totalTime) {
          var countdown = new Countdown({
            el: $entry.find('.js-gl-countdown'),
            type: 'text'
          })
            .render(leftTime * 1000)
            .on('change:leftTime', function(e) {
            });
        });
      }

    }

    return {
      $entry: $entry,
      view: ticketView
    };
  },

  //common APIs

  renderUpdateUnread: function(model) {
    var unRead = model.getUnreadCount();
    this.$unRead.html('<span>'+unRead > 99 ? 99 : unRead+'</span>');
  },

  update: function(viewInfo) {
    var router = viewInfo.router === '#' ? '' : viewInfo.router;
    var $entry = this.$entryGroup.find('.router').filter('[href="#' + router + '"]');

    //快捷入口不存在
    if (!$entry.length) {
      var entry = this.model.getEntryInfo(viewInfo);

      entry.initId = viewInfo.initId;

      var entryInfo = this._initEntry(entry);

      $entry = entryInfo.$entry;
      this.$entryGroup.append($entry);

      this.updateQuickEntry();

      return false;
    }

    var prevId = Number($entry.data('id'));

    //if (!prevId) {
      //快捷入口已存在,没有初始化
      $entry.data('id', viewInfo.initId);
      $entry.removeClass('js-gl-entry-item-' + prevId).addClass('js-gl-entry-item-' + viewInfo.initId)
        .data('id', viewInfo.initId)
        .attr('data-id', viewInfo.initId);
        //.attr('href', '#' + router);
    //}

    //快捷入口已存在,并已初始化
    this.updateQuickEntry();
  },

  remove: function(initId) {
    this.$entryGroup.find('.js-gl-entry-item-' + initId).remove();
  },

  changeActiveInfo: function(id, router) {
    var $active = this.$entryGroup.find('.active');
    var prevId = $active.data('id');
    router = router === '#' ? '' : router;
    //$active.removeClass('js-gl-entry-item-' + prevId).addClass('js-gl-entry-item-' + id).data('id', id).attr('href', '#' + router);
    $active.removeClass('js-gl-entry-item-' + prevId).addClass('js-gl-entry-item-' + id).data('id', id);

    return prevId;
  },

  getCurrent: function() {
    return this.$el.find('.active').data('id');
  },

  updateQuickEntry: function(hash) {
    hash = hash || window.location.hash || '#';
    var $quickEntries = this.$entryGroup.find('.router');
    var $current;

    $quickEntries.each(function(index, entry) {
      var $entry = $(entry);

      if (hash.replace(/\?.*/, '') === $entry.attr('href')) {
        $current = $entry;
      }
    });

    if ($current && $current.length) {
      $current.addClass('active').siblings().removeClass('active');
    } else {
      $quickEntries.removeClass('active');
    }
  },

  isExceed: function(router) {
    return !this.model.isQuick(router);
  },

  delNotQuickEntry: function() {
    var $entry = this.$entryGroup.find('.js-gl-not-quick-entry-item');
    var initId = $entry.data('id');
    $entry.remove();
    return initId;
  },

  clear: function() {
    var $removeEntry = this.$entryGroup.find('.router').not('.active');
    this.$entryGroup.find('.router').filter('.active').removeClass('active').addClass('js-gl-not-quick-entry-item');
    $removeEntry.each(function(index, entry) {
      var $entry = $(entry);
      var id = $entry.data('id');
      if (id) {
        Global.viewPool.removeById(id);
      }
    });
    $removeEntry.remove();
  },

  //event handlers

  selectTicketHandler: function(e) {
    $(e.currentTarget).closest('.js-gl-ticket-main').removeClass('is-show');
  },

  entryClickHandler: function(e) {
    var $target = $(e.currentTarget);
    var initId = Number($target.data('id'));
    var pool = Global.viewPool.getById(initId);
    if (initId) {
      if (pool) {
        if (pool.globalRegin) {
          pool.globalRegin.show(pool.globalView, {
            preventRender: true,
            preventDestroy: true
          });
        } else {
          pool.regin.show(pool.view, {
            preventRender: true,
            preventDestroy: true
          });
        }

        Global.appRouter.navigate(pool.router, {trigger: false, replace: false});

        this.updateQuickEntry($target.attr('href'));

        return false;
      } else {
      }
    }
  },

  inSettingHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.find('.js-qe-btn').addClass('fa-spin');
  },

  outSettingHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.find('.js-qe-btn').removeClass('fa-spin');
  },

  openSettingHandler: function(e) {
    var self = this;
    var entrySettingView;

    var $dialog = Global.ui.dialog.show({
      title: '定制快捷入口',
      size: 'modal-lg',
      body: '<div class="js-gl-quick-setting"></div>',
      bodyClass: 'no-padding',
      footer: '<div class="text-center control-confirm-special ">' +
      '<p class="text-pleasant text-center">注：最多可自由选择4个快捷菜单。</p>' +
      '<button type="button" class="js-gl-confirm btn btn-left " data-loading-text="保存中">保存修改</button>' +
      //'<button type="button" class="btn btn-link btn-right " data-dismiss="modal">取消</button>' +
      '</div>'
    });

    var $chaseContainer = $dialog.find('.js-gl-quick-setting');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      entrySettingView.destroy();
    });

    entrySettingView = new EntrySettingView({
      el: $chaseContainer,
      functionId: this.model.get('functionId'),
      ticketId: this.model.get('ticketId')
    }).render();

    $dialog.on('click', '.js-gl-confirm', function(e) {
      var $target = $(e.currentTarget);

      $target.button('loading');
      self.model.saveSettingXhr(entrySettingView.getSelected())
        .always(function() {
          $target.button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {

            Global.ui.notification.show('保存快捷入口设置成功', {
              type: 'success'
            });
            $dialog.modal('hide');
          } else {
            Global.ui.notification.show('保存快捷入口设置失败');
          }
        });
    });
  },


});

module.exports = EntryView;
