"use strict";

require('./index.scss');

//var NewsBarView = require('../newsBar');

var ticketConfig = require('skeleton/misc/ticketConfig');

var WithdrawView = require('fundCenter/views/withdraw');

var InsideLetterView2 = require('skeleton/bases/insideLetter2');

var NoticeBoardView = require('dynamicCenter/views/noticeBoardFH');

var HeaderView = Base.ItemView.extend({

  template: require('./index.html'),

  isBindQQ: 0,
  
  itemTpl:_.template(require('dynamicCenter/templates/noticeBoard-item.html')),
  AfficheTpl:_.template(require('dynamicCenter/templates/noticeDetail.html')),
  dialog: _.template(require('skeleton/bases/header/indexmostDialog.html')),
  events: {
    //'click .js-gl-hd-notice-container': 'toggleNoticeHandler',
    'click .js-gl-h-ticket-main': 'clickEmptyTicketMainHandler',
    'click .js-gl-hd-refresh': 'refreshHandler',
    //'click .js-fc-re': 'rechargeHandler',
    'click .js-fc-wd': 'withdrawHandler',
    'click .js-gl-hd-logout': 'logoutHandler',
    'mouseover .js-bc-lottery-list': 'lotteryListHandler',
    'mouseout .js-bet-lottery-menu': 'outlotteryListHandler',
    'click .js-affiche-show': 'afficShowHandler',

    'click .js-letterList-titleLine': 'bindMessageUserList',

    'mouseover .js-gl-letter-unread': 'letterRed',
    'mouseout .js-gl-letter-unread': 'letterBlack',
    'mouseover  .js-athena-three': 'MyAccount',
    'mouseout  .js-athena-three': 'MyAccountOut',
    'click  .js-athena-eyes-account': 'MyAccountEyes',
    'mouseover  .js-gl-letter-unread-span': 'MessageSpan',
    'click  .js-message-small': 'MostSpan',
    'click  .js-detail': 'MostDetail',
    'click  .js-rightMenuBtn': 'rightMenuTrigger',
    'click  .js-cBtn': 'cBtn',
    'click  .js-headinfoclose': 'headinfoclose'
    
  },

  headinfoclose: function () {
    if($('.js-gl-head-main-menu').hasClass('gl-head-main-menuClose'))
    {
      $('.js-gl-head-main-menu').removeClass('gl-head-main-menuClose')
    }
    else{
      $('.js-gl-head-main-menu').addClass('gl-head-main-menuClose')
    }
  },

  cBtn: function (e) {
    if ( this.$('.js-cBtn i').hasClass('icon-chevron-up') ) {
      this.$('.js-cBtn i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
      this.$('.js-cBtn i').addClass('cBtn2');
      this.$('.js-head').addClass('headh');
      $('.js-head').animate({height: '20px'}, 600);
    }
    else{
      this.$('.js-cBtn i').addClass('icon-chevron-up').removeClass('icon-chevron-down');
      this.$('.js-cBtn i').removeClass('cBtn2');
      this.$('.js-head').removeClass('headh');
      $('.js-head').animate({height: '104px'}, 600);
    }
  },

  rightMenuTrigger: function (e) {
    if ( $('.js-rightMenuHeight').height() == 0 ) {
      $('.js-rightMenuHeight').animate({height:188},600,function () {
        $('.js-rightMenuBtn i').eq(1).addClass('hidden');
        $('.js-rightMenuBtn i').eq(0).removeClass('hidden');
        $('.js-rightMenuBtn span').eq(1).addClass('hidden');
        $('.js-rightMenuBtn span').eq(0).removeClass('hidden');
      });
    }
    else{
      $('.js-rightMenuHeight').animate({height:0},600,function () {
        $('.js-rightMenuBtn i').eq(0).addClass('hidden');
        $('.js-rightMenuBtn i').eq(1).removeClass('hidden');
        $('.js-rightMenuBtn span').eq(0).addClass('hidden');
        $('.js-rightMenuBtn span').eq(1).removeClass('hidden');
      });
    }
  },

  bindMessageUserList: function (e) {
    var $target = $(e.currentTarget);

    if (this.isBindQQ == 0) {
      this.isBindQQ = 1;
      $target.parent().removeClass('letterList-close');
      var insideLetterView2 = new InsideLetterView2({
        el: $('.js-nc-insideLetter2'),
        reqData: {
          userId: '',
          name: ''
        }
      }).render();
      $('.js-single-lowLevelSelect').animate({height:"551px"});
    }
    else if (this.isBindQQ == 1) {
      this.isBindQQ = 2;
      $('.js-single-lowLevelSelect').animate({height:"0px"});
      $target.parent().addClass('letterList-close');

      $('.js-info-window').fadeOut("fast");
      $('.js-selected-container').fadeOut("fast");
    }
    else{
      this.isBindQQ = 1;
      $target.parent().removeClass('letterList-close');
      $('.js-single-lowLevelSelect').animate({height:"551px"});
    }
  },

  MostDetail:function(){
    
  },

  MostSpan:function () {
    var self = this;
    var $dialog = Global.ui.dialog.show({
      title: '系统消息',
      size: 'modal-lg',
      body: '<div  style="background-color: #fff;" class="js-pw-container"></div>',
      bodyClass: 'ac-periodWay-dialog'
    });
    $dialog.find('.ac-periodWay-dialog').removeClass('modal-body');
    $dialog.find('.js-pw-container').html(this.dialog());
    $dialog.on('hidden.modal', function () {
        $(this).remove();
    });
    $('.js-message_A').on('click',function(){
      $('.js-menuspan-one').removeClass('menuspan');
      $('.js-menuspan-two').addClass('menuspan');
    })
    $('.js-detail').on('click',function(){
          $('.js-menuspan-one').addClass('menuspan');
      $('.js-menuspan-two').removeClass('menuspan');
    })
  },
  MessageSpan:function(){
      if($('.js-gl-letter-unread-span').html()==0){
        alert(1);
      }
  },
  MyAccountEyes:function(){
    //alert(1);
    if( $('.js-athena-eyes-account').hasClass('athena-eyes')){
      $('.js-athena-eyes-account').removeClass('athena-eyes').addClass('athena-eyes-off');
      $('.js-gl-hd-balance').html('******');
    }else{
      $('.js-athena-eyes-account').removeClass('athena-eyes-off').addClass('athena-eyes');
      $('.js-gl-hd-balance').html('1114.7');
    }
  },
  MyAccountOut:function(){
    $('.js-athena-three').removeClass('athena-three-up').addClass('athena-three')
  },
  MyAccount:function(){
    $('.js-athena-three').removeClass('athena-three').addClass('athena-three-up');
  },
  letterRed:function(e){
    $('.js-gl-letter-unread').removeClass('athena-message');
    $('.js-gl-letter-unread').addClass('athena-message1');
  },

  letterBlack:function(e){
    $('.js-gl-letter-unread').removeClass('athena-message1');
    $('.js-gl-letter-unread').addClass('athena-message');
      //alert($('.js-gl-letter-unread-span').html());
    if($('.js-gl-letter-unread-span').html()==undefined){
          //alert(1);
    }
  },

  tempMouseover:function(e){
    //this.clearClick();
    var $target = $(e.currentTarget);
    var index = $target.data('index');
    var self = this;
    if(index==1) {
        if(! self.$('.js-athena_st_01').hasClass('athnea-st_03')) {
          self.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
          self.$('.js-athena_st_01').addClass('athnea-st_02');
        }
    };
    if(index==2) {
      if(! self.$('.js-athena_st_02').hasClass('athnea-cp_03')) {
        self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
        self.$('.js-athena_st_02').addClass('athnea-cp_02');
      }
    };
    if(index==3) {
      if(! self.$('.js-athena_st_03').hasClass('athnea-zr_03')) {
        self.$('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
        self.$('.js-athena_st_03').addClass('athnea-zr_02');
      }
    };
    if(index==4) {
      if(! self.$('.js-athena_st_04').hasClass('athnea-yh_03')) {
        self.$('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
        self.$('.js-athena_st_04').addClass('athnea-yh_02');
      }
    };
    if(index==5) {
      if(! self.$('.js-athena_st_05').hasClass('athnea-gg_03')) {
        self.$('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
        self.$('.js-athena_st_05').addClass('athnea-gg_02');
      }
    };
    if(index==6) {
      if(! self.$('.js-athena_st_06').hasClass('athnea-zx_03')) {
        self.$('.js-athena_st_06').removeClass('athnea-zx_01').removeClass('athnea-zx_02').removeClass('athnea-zx_03');
        self.$('.js-athena_st_06').addClass('athnea-zx_02');
      }
    };
  },

  afficShowHandler: function() {
    this.renderBulletin();

    //var self = this;
    //var html = '<div class="affiche-body-back">'+
    //    '<div class="affiche-body-leftBody">' +
    //    '<div class="affiche-body-lefthead">公告列表</div>'+
    //    '<div class="js-affiche-list affiche-body-list"></div>'+
    //    '</div>' +
    //    '<div class="affiche-body-detail">' +
    //    '<div class="affiche-body-righthead">平台公告<span class="affiche-body-close sfa sfa-dialog-close close js-no-lock" data-dismiss="modal"></span></div>' +
    //    // '<div  class="affiche-body-righthead">平台公告<button type="button" class="affiche-body-close pull-right" data-dismiss="modal">x</button></div>' +
    //    '<div class="js-affiche-detail affiche-detail-content"></div>'+
    //    '</div>'+
    //    '</div>';
    //
    //var $dialog = Global.ui.dialog.show({
    //  size: 'modal-lg',
    //  body: html,
    //  bodyClass: 'ac-affiche-dialog'
    //});
    //
    //$dialog.find('.ac-affiche-dialog').removeClass('modal-body');
    //this.$grid = $dialog.find('.js-affiche-list');
    //this.$gridDetail = $dialog.find('.js-affiche-detail');
    //
    //$dialog.on('hidden.modal', function () {
    //  $(this).remove();
    //});
    //
    //self.startLoadAfficheList();
    //
    //$dialog.find('.js-affiche-list').on('click','.js-board-Affiche',function (e) {
    //  var $target = $(e.currentTarget);
    //  $dialog.find('.affiche-list-active').removeClass('affiche-list-active');
    //  $target.addClass('affiche-list-active');
    //  var afficheId = $target.data('affiche');
    //  self.startLoadAfficheDetail(afficheId);
    //});
    
  },

  startLoadAfficheDetail:function (afficheId) {
    var self = this;
    Global.sync.ajax({
          url: '/info/activitylist/userGetbulletindetail.json',
          data: {
            bulletinId: afficheId
          }
        })
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res) {
          if (res && res.result === 0) {
            self.renderAfficheDetail(res.root);
          } else {
            Global.ui.notification.show('通知详情获取失败');
          }
        });

  },

  getTeamOnlineXhr: function() {
    var timestamp = Date.parse(new Date());
    var now = _(timestamp).toDate();
    return Global.sync.ajax({
      url: '/info/teamreport/subuserstat.json',
      data: {
        'startTime': now,
        'endTime': now
      }
    });
  },

  renderAfficheDetail:function (rootInfo) {
    this.$gridDetail.html(this.AfficheTpl());
    this.$gridDetail.find('.js-nc-noticeDetailTitle').html(rootInfo.title);
    this.$gridDetail.find('.js-nc-noticeDetailDate').html(_(rootInfo.time).toTime());
    this.$gridDetail.find('.js-nc-noticeDetailContext').html(rootInfo.content);
  },

  startLoadAfficheList:function () {
    var self = this;
    Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data: {
        'pageSize': 20,
        'pageIndex': 0
      }
    }).always(function(){
      //开始加载

    })
    .done(function(res) {
      var data = res.root || {};
      if (res && res.result === 0) {
        self.renderGrid(data.buList);
      } else {
        Global.ui.notification.show('加载失败，请稍后再试');
      }
    })
    .fail(function () {
      Global.ui.notification.show('网络报错！');
    });
  },

  renderGrid: function(rowList) {
    var self = this;
    self.startLoadAfficheDetail(_.first(rowList).bulletionId);

    if (_.isEmpty(rowList)) {
      this.$grid.html(this.getEmptyHtml('暂时没有动态'));
    } else {
      this.$grid.html(_(rowList).map(function(rowInfo) {
        var date = new Date(rowInfo.time);
        return this.itemTpl({
          title: rowInfo.title,
          date: date.getFullYear() +
          '-' + (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) +
          '-' + (date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()) ,
          afficheId: rowInfo.bulletionId,
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
  },
  

  lotteryListHandler: function() {
    this.$('.js-bet-lottery-menu').show();

  },

  outlotteryListHandler: function() {
    this.$('.js-bet-lottery-menu').hide();
  },

  checkPayPwdXhr: function() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    });
  },
  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json'
    });
  },

  serializeData: function() {
    return {
      ticketList: ticketConfig.getCompleteAll()
    };
  },

  onRender: function() {
    var self = this;

    this.$ticketDropdown = this.$('.js-gl-h-ticket-dropdown');
    this.$dividend = this.$('.js-gl-dividend');
    this.$rush = this.$('.js-gl-rush');

    this.subscribe('acct', 'acct:updating', function() {
      self.renderAcctInfo();
    });

    this.$('.js-gl-head-acct-menu').dropMenu();
    this.$('.js-gl-head-main-menu').dropMenu();
    this.$('.js-gl-head-money-menu').dropMenu();
    this.$('.js-athena-three').removeClass('athena-three').addClass('athena-three-up');

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-vipFlag').html('V'+acctInfo.memberLevel);

    this.$('.js-head li').on('click',function () {
      var id = $(this).data('id')
      if ( id != 5){
        $('.head li').removeClass('sd');
        $('.head li').eq(id-1).addClass('sd');
        var iLeft = 500 + (id - 1) * 116;

        $('.js-head > strong').animate({left: iLeft}, 500,function () {
         
        });
      }
    });

    this.$('.athena-asdf').find('.js-lottery-id').on('click',function () {
      self.clearClick();
      self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      self.$('.js-athena_st_02').addClass('athnea-cp_03');

    });
    //this.initMenuList();
    this.getTeamOnlineXhr().done(function (res) {
      var data = res && res.root || {};
      if (res && res.result === 0) {
        $('.js-julien-data1').text( (data.balanceTotal / 10000).toFixed(2) );
        $('.js-julien-data2').text( data.todayRegTotal);
        $('.js-julien-data3').text( data.todayOnlineTotal);
        $('.js-julien-data4').text( data.todayBonusTotal);
      }
    });

    var w = 0;
    var w2 = 0;
    setTimeout(function(){
      w = $('.drop-menu .g span').width();
      w2 = w;

      $('.js-p').width($('.js-athena-three').width() + 23);

      setInterval(function() {
        if(w2 + w <= 0){
          w2 = w;
        }
        else{
          w2 -= 1;
        }
        
        $('.drop-menu .g span').css('left',w2);
      }, 20);
    }, 1000);

    if(!Global.cookieCache.get('hasLoadBulletin')){
      Global.cookieCache.set('hasLoadBulletin', true);
      this.renderBulletin();
    }
    
  },
  //newPlan:function () {
  //
  //  var self = this;
  //
  //  var $dialog = Global.ui.dialog.show({
  //    title:'提示',
  //    size: 'modal-lg',
  //    body: '<div  style="background-color: #fff;" class="js-pw-container"></div>',
  //    bodyClass: 'ac-periodWay-dialog'
  //  });
  initMenuList: function() {
    var self = this;
    this.$('.js-athena_st_01').mouseover(function(){
      self.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
      $('.js-athena_st_01').addClass('athnea-st_02');
    });
    this.$('.js-athena_st_01').mouseout(function(){
      self.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
      $('.js-athena_st_01').addClass('athnea-st_01');
    });

    this.$('.js-athena_st_02').mouseover(function(){
      self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      $('.js-athena_st_02').addClass('athnea-cp_02');
    });
    this.$('.js-athena_st_02').mouseout(function(){
      self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      $('.js-athena_st_02').addClass('athnea-cp_01');
    });


    this.$('.js-athena_st_03').mouseover(function(){
      self.$('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
      $('.js-athena_st_03').addClass('athnea-zr_02');
    });
    this.$('.js-athena_st_03').mouseout(function(){
      self.$('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
      $('.js-athena_st_03').addClass('athnea-zr_01');
    });
    //优惠活动
    this.$('.js-athena_st_04').mouseover(function(){
      self.$('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
      $('.js-athena_st_03').addClass('athnea-yh_02');
    });
    this.$('.js-athena_st_04').mouseout(function(){
      self.$('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
      $('.js-athena_st_04').addClass('athnea-yh_01');
    });
    //平台公告
    this.$('.js-athena_st_05').mouseover(function(){
      self.$('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
      $('.js-athena_st_03').addClass('athnea-gg_02');
    });
    this.$('.js-athena_st_05').mouseout(function(){
      self.$('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
      $('.js-athena_st_05').addClass('athnea-gg_01');
    });
    this.$('.js-athena_st_06').mouseout(function(){
      self.$('.js-athena_st_06').removeClass('athnea-zx_01').removeClass('athnea-zx_02').removeClass('athnea-zx_03');
      $('.js-athena_st_06').addClass('athnea-zx_01');
    });
  },

  renderAcctInfo: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$('.js-gl-hd-nickName').text(acctInfo.uName ? acctInfo.uName : acctInfo.username);
    this.$('.js-gl-hd-balance').text(acctInfo.fBalance);
    this.$('.js-gl-ag-balance').text(acctInfo.agBalance);

  },

  toggleDividend: function(auth) {
    this.$dividend.toggleClass('hidden', !auth);
  },

  toggleRush: function(auth) {
    this.$rush.toggleClass('hidden', !auth);
  },

  //event handlers

  clickEmptyTicketMainHandler: function(e) {
    var $target = $(e.target);
    if ($target.hasClass('js-gl-h-ticket-entry') || $target.closest('.js-gl-h-ticket-entry').length) {
      this.$ticketDropdown.dropdown('toggle');
    } else {
      return false;
    }
  },

  //toggleNoticeHandler: function(e) {
  //  var self = this;
  //  var $target = $(e.currentTarget);
  //
  //  if (!$target.data('popover')) {
  //    var $html = $('<div class="width-md">');
  //    this.newsBarView = new NewsBarView();
  //    $target.popover({
  //      content: $html,
  //      placement: 'bottom',
  //      html: true
  //    }).popover('show');
  //
  //    $html.html(this.newsBarView.render().$el);
  //
  //  }
  //  $target.off('hide').on('hide', function() {
  //    self.newsBarView.hidden();
  //  });
  //},

  refreshHandler: function(e) {
    var $target = $(e.currentTarget);

    $target.addClass('fa-spin');

    Global.m.oauth.check()
      .always(function() {
        $target.removeClass('fa-spin');
      });
  },

  logoutHandler: function(e) {
    Global.ui.loader.show();

    $(document).confirm({

      content: '<div class="m-top-md m-bottom-lg">确定要退出登录？</div>',
      type: 'exit',
      agreeCallback: function() {
        Global.oauth.logout().done(function(data) {
          if (data && data.result === 0) {
            Global.cookieCache.clear('token');

            window.location.href = 'login.html';
          }
        }).always(function() {
          Global.ui.loader.hide();
        });
      }
    });

    return false;
  },

  withdrawHandler: function() {
    var self = this;
    var acctInfo = Global.memoryCache.get('acctInfo');
    if (!acctInfo || acctInfo.userStatus === 100) {
      // alert('用户已被冻结，无法进行充值操作。');
      Global.ui.notification.show('用户已被冻结，无法进行提现操作。');
      return false;
    }

    this.getInfoXhr()
        .always(function() {
          //self.loadingFinish();
        })
        .done(function(res) {
          var data = res && res.root || {};
          if (res && res.result === 0) {
            if (data.hasMoneyPwd && data.hasBankCard) {
              //设置了则弹出验证框
              $(document).verifyFundPwd({parentView:self});
            } else if (!data.hasMoneyPwd || !data.hasBankCard) {
              if(!data.hasMoneyPwd){
                //未设置则弹出链接到资金密码设置页面的提示框
                $(document).securityTip({
                  content: '您未设置资金密码，无法进行提现操作',
                  showMoneyPwd: true,
                  hasMoneyPwd: false,
                  showBankCard: false,
                  hasBankCard: false
                });
              }else if (!data.hasBankCard){
                //未设置则弹出链接到资金密码设置页面的提示框
                $(document).securityTip({
                  content: '您未绑定银行卡，无法进行提现操作',
                  showMoneyPwd: false,
                  hasMoneyPwd: true,
                  showBankCard: true,
                  hasBankCard: false
                });
              }
            }
          } else {
            Global.ui.notification.show('服务器异常');
          }
        });

  },

  verifySuccCallBack: function(payPwd){
    var withdrawView = new WithdrawView({parentView: this,payPwd:payPwd});
    this.$dialogWd = Global.ui.dialog.show({
      id: _.now(),
      title: '提现',
      size: 'modal-lg',
      body:  '<div class="js-fc-wd-container"></div>'
    });

    this.$dialogWd.find('.modal-body').addClass('fc-wd-bg');
    this.$dialogWd.find('.fc-wd-bg').removeClass('modal-body');

    this.$dialogWd.find('.js-fc-wd-container').html(withdrawView.render().el);

    this.$dialogWd.on('hidden.modal', function () {
      $(this).remove();
    });

  },

  closeWithdrawDialog: function() {
    this.$dialogWd.modal('hide');
  },

  renderBulletin: function(bulletinId) {
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
        bulletinId: bulletinId
      }
    }).render();
  },

});

module.exports = HeaderView;