"use strict";

require('./index.scss');

var ticketConfig = require('skeleton/misc/ticketConfig');

var WithdrawView = require('fundCenter/views/withdraw');

var HeaderView = Base.ItemView.extend({

  template: require('./index.html'),
  dialog: _.template(require('skeleton/bases/header/indexmostDialog.html')),
  noticeItemTpl: _(require('./notice-item-header.html')).template(),

  events: {
    'click .js-gl-hd-refresh': 'refreshHandler',
    'click .js-fc-wd': 'withdrawHandler',
    'click .js-gl-hd-logout': 'logoutHandler',
    'click  .js-h-security': 'accountSecurityHandler',
    'click  .js-head-info-close': 'headInfoCloseHandler'
  },

  getNoticeInfoXhr: function() {
    return Global.sync.ajax({
      url: '/info/activitylist/getbroadcastlist.json'
    });
  },

  headInfoCloseHandler: function() {
    this.$('.js-gl-head-main-menu').toggleClass('h-head-info-hide');
  },

  accountSecurityHandler:function(e) {
    var $target = $(e.currentTarget);
    if($target.hasClass('sfa-h-security-off')) {
      this.$('.js-h-security').removeClass('sfa-h-security-off').addClass('sfa-h-security');
      this.$('.js-gl-hd-balance').text('******');
    } else {
      var acctInfo = Global.memoryCache.get('acctInfo');
      this.$('.js-h-security').removeClass('sfa-h-security').addClass('sfa-h-security-off');
      this.$('.js-gl-hd-balance').text(acctInfo.fBalance);
    }
  },

  getWithDrawInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/withdraw/info.json'
    });
  },

  onRender: function() {
    var self = this;

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

    this.renderNotice();
    setInterval(function() {
      self.renderNotice();
    }, 60000);
  },

  renderNotice: function() {
    var self = this;
    this.getNoticeInfoXhr()
      .done(function(res) {
        var data;
        if(res.result === 0) {
          data = res.root || [];

          self.$noticeList.html('<marquee  behavior="scroll" id="scrollText" onmouseover="scrollText.stop();"' +
            ' onmouseout="scrollText.start();" scrollAmount="2" direction="left">' + _(data).map(function(info) {
              return self.noticeItemTpl(info);
            }).join('') + '</marquee>');
        }
      });
  },

  renderUpdateUnread: function(model) {
    var unRead = model.getUnreadCount();
    unRead = unRead > 99 ? 99 : unRead;
    this.$letterUnread.html(unRead).toggleClass('spot-hot', !!unRead);
  },

  renderAcctInfo: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$('.js-gl-hd-nickName').text(acctInfo.uName ? acctInfo.uName : acctInfo.username);
    this.$('.js-gl-hd-balance').text(acctInfo.fBalance);
    this.$('.js-gl-ag-balance').text(acctInfo.agBalance);
    this.$('.js-gl-total-balance').text(acctInfo.fBalance + acctInfo.agBalance);

  },

  //event handlers

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
          if(data && data.result === 0) {
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
    if(!acctInfo || acctInfo.userStatus === 100) {
      // alert('用户已被冻结，无法进行充值操作。');
      Global.ui.notification.show('用户已被冻结，无法进行提现操作。');
      return false;
    }

    this.getWithDrawInfoXhr()
      .done(function(res) {
        var data = res && res.root || {};
        if(res && res.result === 0) {
          if(data.hasMoneyPwd && data.hasBankCard && data.hasSecurity) {
            //设置了则弹出验证框
            // $(document).verifyFundPwd({parentView:self});
            self.verifySuccCallBack();
          } else if(!data.hasMoneyPwd || !data.hasBankCard || !data.hasSecurity) {
            if(!data.hasMoneyPwd) {
              //未设置则弹出链接到资金密码设置页面的提示框
              $(document).securityTip({
                content: '您未设置资金密码，无法进行提现操作',
                showMoneyPwd: true,
                hasMoneyPwd: false,
                showBankCard: false,
                hasBankCard: false
              });
            } else if(!data.hasBankCard) {
              //未设置则弹出链接到资金密码设置页面的提示框
              $(document).securityTip({
                content: '您未绑定银行卡，无法进行提现操作',
                showMoneyPwd: false,
                hasMoneyPwd: true,
                showBankCard: true,
                hasBankCard: false
              });
            } else if(!data.hasSecurity) {
              //未设置则弹出链接到密保问题设置页面的提示框
              $(document).securityTip({
                content: '请补充完您的安全信息后再提现',
                showMoneyPwd: true,
                hasMoneyPwd: data.hasMoneyPwd,
                showBankCard: true,
                hasBankCard: data.hasBankCard,
                hasSecurity: data.hasSecurity
              });
            }
          }
        } else {
          Global.ui.notification.show('服务器异常');
        }
      });
  },

  verifySuccCallBack: function(payPwd) {
    var withdrawView = new WithdrawView({parentView: this, payPwd: payPwd});
    this.$dialogWd = Global.ui.dialog.show({
      id: _.now(),
      title: '提现',
      size: 'modal-lg',
      body: '<div class="js-fc-wd-container"></div>'
    });

    this.$dialogWd.find('.modal-body').addClass('fc-wd-bg');
    this.$dialogWd.find('.fc-wd-bg').removeClass('modal-body');

    this.$dialogWd.find('.js-fc-wd-container').html(withdrawView.render().el);

    this.$dialogWd.on('hidden.modal', function() {
      $(this).remove();
    });
  }
});

module.exports = HeaderView;