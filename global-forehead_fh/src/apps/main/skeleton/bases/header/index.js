"use strict";

require('./index.scss');

//var NewsBarView = require('../newsBar');

var ticketConfig = require('skeleton/misc/ticketConfig');

var WithdrawView = require('fundCenter/views/withdraw');

var HeaderView = Base.ItemView.extend({

  template: require('./index.html'),
  
  itemTpl:_.template(require('dynamicCenter/templates/noticeBoard-item.html')),
  AfficheTpl:_.template(require('dynamicCenter/templates/noticeDetail.html')),

  events: {
    //'click .js-gl-hd-notice-container': 'toggleNoticeHandler',
    'click .js-gl-h-ticket-main': 'clickEmptyTicketMainHandler',
    'click .js-gl-hd-refresh': 'refreshHandler',
    //'click .js-fc-re': 'rechargeHandler',
    'click .js-fc-wd': 'withdrawHandler',
    'click .js-gl-hd-logout': 'logoutHandler',
    'mouseover .js-bc-lottery-list': 'lotteryListHandler',
    'mouseout .js-bet-lottery-menu': 'outlotteryListHandler',
    'click .js-affiche-show': 'afficShowHandler'
  },

  afficShowHandler: function() {
    var self = this;
    var html = '<div class="affiche-body-back">'+
        '<div class="affiche-body-leftBody">' +
        '<div class="affiche-body-lefthead">公告列表</div>'+
        '<div class="js-affiche-list affiche-body-list"></div>'+
        '</div>' +
        '<div class="affiche-body-detail">' +
        '<div  class="affiche-body-righthead">平台公告<button type="button" class="affiche-body-close pull-right" data-dismiss="modal">x</button></div>' +
        '<div class="js-affiche-detail affiche-detail-content"></div>'+
        '</div>'+
        '</div>';

    var $dialog = Global.ui.dialog.show({
      size: 'modal-lg',
      body: html,
      bodyClass: 'ac-affiche-dialog'
    });

    $dialog.find('.ac-affiche-dialog').removeClass('modal-body');
    this.$grid = $dialog.find('.js-affiche-list');
    this.$gridDetail = $dialog.find('.js-affiche-detail');
    
    $dialog.on('hidden.modal', function () {
      $(this).remove();
    });
    
    self.startLoadAfficheList();
    
    $dialog.find('.js-affiche-list').on('click','.js-board-Affiche',function (e) {
      var $target = $(e.currentTarget);
      var afficheId = $target.data('affiche');
      self.startLoadAfficheDetail(afficheId);
    });
    
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

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-vipFlag').html('V'+acctInfo.memberLevel);

    this.$('.head li').on('click',function () {
      $('.head li').removeClass('sd');
      $(this).addClass('sd');
    });
  },

  renderAcctInfo: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    this.$('.js-gl-hd-nickName').text(acctInfo.uName ? acctInfo.uName : acctInfo.username);
    this.$('.js-gl-hd-balance').text(acctInfo.fBalance);
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
    var self = this;
    this.$dialogWd = Global.ui.dialog.show({
      id: _.now(),
      title: '提现',
      size: 'modal-md',
      body:  '<div class="js-fc-wd-container"></div>'
    });

    this.$dialogWd.find('.js-fc-wd-container').html(withdrawView.render().el);

    this.$dialogWd.on('hidden.modal', function (e) {
      $(this).remove();
      //self.destroy();
    });
  },
  closeWithdrawDialog: function() {
    this.$dialogWd.modal('hide');
  },

});

module.exports = HeaderView;

