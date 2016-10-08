"use strict";

require('./index.scss');

var ticketConfig = require('skeleton/misc/ticketConfig');

var WithdrawView = require('fundCenter/views/withdraw');

var InsideLetterView2 = require('skeleton/bases/insideLetter2');

var PlatformNewsView = require('newsCenter/views/platformNews');

var HeaderView = Base.ItemView.extend({

  template: require('./index.html'),

  isBindQQ: 0,

  itemTpl:_.template(require('dynamicCenter/templates/noticeBoard-item.html')),
  AfficheTpl:_.template(require('dynamicCenter/templates/noticeDetail.html')),
  dialog: _.template(require('skeleton/bases/header/indexmostDialog.html')),
  noticeItemTpl: _(require('./notice-item-header.html')).template(),

  events: {
    'click .js-gl-h-ticket-main': 'clickEmptyTicketMainHandler',
    'click .js-gl-hd-refresh': 'refreshHandler',
    'click .js-fc-wd': 'withdrawHandler',
    'click .js-gl-hd-logout': 'logoutHandler',
    'mouseover .js-bc-lottery-list': 'lotteryListHandler',
    'mouseout .js-bet-lottery-menu': 'outlotteryListHandler',

    //'click .js-letterList-titleLine': 'bindMessageUserList',

    'click  .js-h-security': 'accountSecurityHandler',
    // 'click  .js-system-notice': 'platformNewsHandler',
    'click  .js-head-info-close': 'headInfoCloseHandler'
  },

  getNoticeInfoXhr: function() {
    return Global.sync.ajax({
      url: '/info/activitylist/getbroadcastlist.json'
    });
  },

  headInfoCloseHandler: function () {
    this.$('.js-gl-head-main-menu').toggleClass('h-head-info-hide');
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

  // platformNewsHandler: function() {
  //   var platformNewsView = new PlatformNewsView();
  //   var $dialog = Global.ui.dialog.show({
  //     title: '系统消息',
  //     size: 'modal-lg',
  //     body: '<div class="js-platformNews-container"></div>'
  //   });
  //   $dialog.find('.nc-platformNews-dialog').removeClass('modal-body');
  //   $dialog.find('.js-platformNews-container').html(platformNewsView.render().el);
  //   $dialog.on('hidden.modal', function () {
  //     $(this).remove();
  //   });
  // },

  // systemNoticeHandler: function() {
  //   var $dialog = Global.ui.dialog.show({
  //     title: '系统消息',
  //     size: 'modal-lg',
  //     body: '<div  style="background-color: #fff;" class="js-pw-container"></div>',
  //     bodyClass: 'ac-periodWay-dialog'
  //   });
  //   $dialog.find('.ac-periodWay-dialog').removeClass('modal-body');
  //   $dialog.find('.js-pw-container').html(this.dialog());
  //   $dialog.on('hidden.modal', function () {
  //       $(this).remove();
  //   });
  //   $dialog.on('click ', '.js-message_A', function(){
  //     $('.js-menuspan-one').removeClass('menuspan');
  //     $('.js-menuspan-two').addClass('menuspan');
  //   });
  //   $dialog.on('click ', '.js-detail', function(){
  //     $('.js-menuspan-one').addClass('menuspan');
  //     $('.js-menuspan-two').removeClass('menuspan');
  //   })
  // },

  accountSecurityHandler:function(e) {
    var $target = $(e.currentTarget);
    if($target.hasClass('sfa-h-security-off')){
      this.$('.js-h-security').removeClass('sfa-h-security-off').addClass('sfa-h-security');
      this.$('.js-gl-hd-balance').text('******');
    }else{
      var acctInfo = Global.memoryCache.get('acctInfo');
      this.$('.js-h-security').removeClass('sfa-h-security').addClass('sfa-h-security-off');
      this.$('.js-gl-hd-balance').text(acctInfo.fBalance);
    }
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
  getWithDrawInfoXhr: function() {
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
    this.$noticeList = this.$('.js-h-notice-inner');
    this.$letterUnread = this.$('.js-h-letter-unread');

    this.subscribe('acct', 'acct:updating', function() {
      self.renderAcctInfo();
    });

    this.subscribe('news', 'news:updating', function(model) {
      self.renderUpdateUnread(model);
    });

    this.$('.js-gl-head-acct-menu').dropMenu();
    this.$('.js-gl-head-main-menu').dropMenu();
    this.$('.js-gl-head-money-menu').dropMenu();

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-vipFlag').html('V'+acctInfo.memberLevel);

    this.$('.athena-asdf').find('.js-lottery-id').on('click',function () {
      self.clearClick();
      self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      self.$('.js-athena_st_02').addClass('athnea-cp_03');

    });
    this.getTeamOnlineXhr().done(function (res) {
      var data = res && res.root || {};
      if (res && res.result === 0) {
        $('.js-julien-data1').text( (data.balanceTotal / 10000).toFixed(2) );
        $('.js-julien-data2').text( data.todayRegTotal);
        $('.js-julien-data3').text( data.todayOnlineTotal);
        $('.js-julien-data4').text( data.todayBonusTotal);
      }
    });

    this.renderNotice();
    setInterval(function() {
      self.renderNotice();
    }, 60000);
  },

  renderNotice: function() {
    var self = this;
    this.getNoticeInfoXhr()
      .done(function(res) {
        //console.log("renderNotice res:"+JSON.stringify(res));
        var data;
        if (res.result === 0) {
          data = res.root || [];

          self.$noticeList.html('<marquee  behavior="scroll" id="scrollText" onmouseover="scrollText.stop();"' +
            ' onmouseout="scrollText.start();" scrollAmount="2" direction="left">'+_(data).map(function(info) {
              return self.noticeItemTpl(info);
            }).join('')+'</marquee>');
        }
      });
  },

  renderUpdateUnread: function(model) {
    var unRead = model.getUnreadCount();
    unRead = unRead > 99 ? 99 : unRead;
    this.$letterUnread.html(unRead).toggleClass('h-no-letter', !unRead);
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

      content: '<div class="m-TB-md">确定要退出登录？</div>',
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

    this.getWithDrawInfoXhr()
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
  }
});

module.exports = HeaderView;