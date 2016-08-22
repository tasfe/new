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
    'click .js-affiche-show': 'afficShowHandler',
    //'mouseover .js-athena_cp_01':'athenahover',
    //'mouseover .js-athena_gg_01':'athenahover_gg',
    //'mouseover .js-athena_st_01':'athenahover_st',
    //'mouseover .js-athena_zr_01':'athenahover_zr',
    'click .js-athena_st_04': 'tempClick',
    'click .js-athena_st_02': 'tempClick',
    'click .js-athena_st_03': 'tempClick',
    'click .js-athena_st_01': 'tempClick',
    'click .js-athena_st_05': 'tempClick',
    'click .js-athena_st_06': 'tempClick',
    'click .js-athena_st_07': 'tempClick',
    'click .js-athena_st_08': 'tempClick',
    'click .js-athena_st_09': 'tempClick',
    'click .js-athena_st_10': 'tempClick',
    

    //鼠标经过
    'mouseover .js-athena_st_04': 'tempMouseover',
    'mouseover .js-athena_st_02': 'tempMouseover',
    'mouseover .js-athena_st_03': 'tempMouseover',
    'mouseover .js-athena_st_01': 'tempMouseover',
    'mouseover .js-athena_st_05': 'tempMouseover',
    'mouseover .js-athena_st_06': 'tempMouseover',

    //
    'mouseout .js-athena_st_04': 'tempMouseOut',
    'mouseout .js-athena_st_02': 'tempMouseOut',
    'mouseout .js-athena_st_03': 'tempMouseOut',
    'mouseout .js-athena_st_01': 'tempMouseOut',
    'mouseout .js-athena_st_05': 'tempMouseOut',
    'mouseout .js-athena_st_06': 'tempMouseOut'

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

  tempMouseOut:function(e){
    //this.clearClick();
    var $target = $(e.currentTarget);
    //$(e.currentTarget).mouseover(function(){
    //      alert(index);
    //})
    var index = $target.data('index');
    var self = this;
    // alert(index);
    if(index==1) {
      if(!$('.js-athena_st_01').hasClass('athnea-st_03')) {
        self.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
        self.$('.js-athena_st_01').addClass('athnea-st_01');
      }
    };
    if(index==2) {
      if(! self.$('.js-athena_st_02').hasClass('athnea-cp_03')) {
        self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
        self.$('.js-athena_st_02').addClass('athnea-cp_01');
      }
    };
    if(index==3) {
      if(! self.$('.js-athena_st_03').hasClass('athnea-zr_03')) {
        self.$('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
        self.$('.js-athena_st_03').addClass('athnea-zr_01');
      }
    };
    if(index==4) {
      if(! self.$('.js-athena_st_04').hasClass('athnea-yh_03')) {
        self.$('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
        self.$('.js-athena_st_04').addClass('athnea-yh_01');
      }
    };
    if(index==5) {
      if(! self.$('.js-athena_st_05').hasClass('athnea-gg_03')) {
        self.$('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
        self.$('.js-athena_st_05').addClass('athnea-gg_01');
      }
    };
    if(index==6) {
      if(! self.$('.js-athena_st_06').hasClass('athnea-zx_03')) {
        self.$('.js-athena_st_06').removeClass('athnea-zx_01').removeClass('athnea-zx_02').removeClass('athnea-zx_03');
        self.$('.js-athena_st_06').addClass('athnea-zx_01');
      }
    };
  },

  tempClick:function(e) {

    this.clearClick();
    var $target = $(e.currentTarget);
    //$(e.currentTarget).mouseover(function(){
    //      alert(index);
    //})
    var index = $target.data('index');
   // alert(index);
    if(index==1) {
      this.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
      $('.js-athena_st_01').addClass('athnea-st_03');

      this.$('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
      $('.js-athena_st_01').addClass('athnea-st_03');
    };
    if(index==2) {
      this.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      $('.js-athena_st_02').addClass('athnea-cp_03');

    };
    if(index==3) {
      this.$('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
      $('.js-athena_st_03').addClass('athnea-zr_03');
    };
    if(index==4) {
      this.$('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
      $('.js-athena_st_04').addClass('athnea-yh_03');
    };
    if(index==5) {
      this.$('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
      $('.js-athena_st_05').addClass('athnea-gg_03');
    };
    if(index==6) {
      this.$('.js-athena_st_06').removeClass('athnea-zx_01').removeClass('athnea-zx_02').removeClass('athnea-zx_03');
      $('.js-athena_zx_06').addClass('athnea-zx_03');
    };

  },

  clearClick:function () {

    $('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
    $('.js-athena_st_01').removeClass('athnea-st_01').removeClass('athnea-st_02').removeClass('athnea-st_03');
    $('.js-athena_st_03').removeClass('athnea-zr_01').removeClass('athnea-zr_02').removeClass('athnea-zr_03');
    $('.js-athena_st_04').removeClass('athnea-yh_01').removeClass('athnea-yh_02').removeClass('athnea-yh_03');
    $('.js-athena_st_05').removeClass('athnea-gg_01').removeClass('athnea-gg_02').removeClass('athnea-gg_03');
    $('.js-athena_st_06').removeClass('athnea-zx_01').removeClass('athnea-zx_02').removeClass('athnea-zx_03');


    $('.js-athena_st_02').addClass('athnea-cp_01');
    $('.js-athena_st_01').addClass('athnea-st_01');
    $('.js-athena_st_03').addClass('athnea-zr_01');
    $('.js-athena_st_04').addClass('athnea-yh_01');
    $('.js-athena_st_05').addClass('athnea-gg_01');
    $('.js-athena_st_06').addClass('athnea-zx_01');


  },


  afficShowHandler: function() {

    var self = this;
    var html = '<div class="affiche-body-back">'+
        '<div class="affiche-body-leftBody">' +
        '<div class="affiche-body-lefthead">公告列表</div>'+
        '<div class="js-affiche-list affiche-body-list"></div>'+
        '</div>' +
        '<div class="affiche-body-detail">' +
        '<div  class="affiche-body-righthead">平台公告<span class="affiche-body-close sfa sfa-dialog-close close js-no-lock" data-dismiss="modal"></span></div>' +
        // '<div  class="affiche-body-righthead">平台公告<button type="button" class="affiche-body-close pull-right" data-dismiss="modal">x</button></div>' +
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
      $dialog.find('.affiche-list-active').removeClass('affiche-list-active');
      $target.addClass('affiche-list-active');
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

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$('.js-vipFlag').html('V'+acctInfo.memberLevel);

    this.$('.head li').on('click',function () {
      if ($(this).text() != '平台公告') {
        $('.head li').removeClass('sd');
        $(this).addClass('sd');
      }
    });

    this.$('.athena-asdf').find('.js-lottery-id').on('click',function () {
      self.clearClick();
      self.$('.js-athena_st_02').removeClass('athnea-cp_01').removeClass('athnea-cp_02').removeClass('athnea-cp_03');
      self.$('.js-athena_st_02').addClass('athnea-cp_03');

    });
    //this.initMenuList();
  },

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
  }

});

module.exports = HeaderView;