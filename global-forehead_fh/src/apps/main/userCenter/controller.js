"use scrict";

var RouterController = require('skeleton/controllers/router');

var BettingRecordView = require('userCenter/bettingRecords');

var BettingDetailView = require('userCenter/views/bettingDetail');

var TrackRecordView = require('userCenter/trackRecords/team');
var TrackDetailView = require('userCenter/views/trackDetail');

var RechargeRecordsView = require('userCenter/rechargeRecords/team');

var WithdrawRecordsView = require('userCenter/withdrawRecords/team');


var PersonalManageView = require('userCenter/views/personalManage');
var CardManageView = require('userCenter/views/cardManage');
var CardBindingView = require('userCenter/views/cardBinding');
var PriceDetailsView = require('userCenter/views/priceDetails');

var VipPointView = require('userCenter/vipPoint');
var VipLevelView = require('userCenter/vipLevel');
var VipPrizeView = require('userCenter/vipPrize');
var VipCashView = require('userCenter/vipCash');
var VipCreditView = require('userCenter/vipCredit');


var ReportManageView = require('agencyCenter/reportManage/teamReport');

var BaccaratPalView = require('userCenter/baccaratPal/baccaratPal');
var transforRecordView = require('userCenter/transforRecord/transforRecord');

var UserCenterController = RouterController.extend({

  transforRecord:function () {
    this.changeMainReginView(new transforRecordView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },


  baccaratPal:function () {
    this.changeMainReginView(new BaccaratPalView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  reportManage:function () {
    this.changeMainReginView(new ReportManageView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  checkPayPwdXhr: function() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    });
  },

  bettingRecords: function() {
    this.changeMainReginView(new BettingRecordView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  bettingDetail: function(tradeNo) {
    this.changeSubReginView(new BettingDetailView({
      tradeNo: tradeNo,
      quickEntry: true
    }), {
      parentRouter: 'uc/br',
      main: {
        subReturn: true
      },
      needParent: false,
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  trackRecords: function() {
    this.changeMainReginView(new TrackRecordView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  trackDetail: function(tradeNo) {
    this.changeSubReginView(new TrackDetailView({
      tradeNo: tradeNo
    }), {
      parentRouter: 'uc/tr',
      destroyDiff: false
    });
  },

  rechargeRecords: function() {
    this.changeMainReginView(new RechargeRecordsView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  withdrawRecords: function() {
    this.changeMainReginView(new WithdrawRecordsView(), {
      sidebar: 'uc'
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  vipPoint:function() {
    this.changeMainReginView(new VipPointView(), {
      sidebar: 'vip'
    });
    $('.js-gl-sidebar').addClass('vip-sidebar');
  },

  vipLevel:function() {
    this.changeMainReginView(new VipLevelView(), {
      sidebar: 'vip'
    });
    $('.js-gl-sidebar').addClass('vip-sidebar');
  },
  vipPrize:function() {
    this.changeMainReginView(new VipPrizeView(), {
      sidebar: 'vip'
    });
    $('.js-gl-sidebar').addClass('vip-sidebar');
  },
  vipCash:function() {
    this.changeMainReginView(new VipCashView(), {
      sidebar: 'vip'
    });
    $('.js-gl-sidebar').addClass('vip-sidebar');
  },
  //vipInfo:function() {
  //  this.changeMainReginView(new VipInfoView(), {
  //    sidebar: 'vip'
  //  });
  //
  //},
  vipCredit:function() {
  this.changeMainReginView(new VipCreditView(), {
    sidebar: 'vip'
  });
    $('.js-gl-sidebar').addClass('vip-sidebar');
},

  personalManage: function() {
    this.changeMainReginView(new PersonalManageView(), {
      sidebar: 'pc'
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },

  cardManage: function() {
    //判断是否设置资金密码

    var self  = this;
    this.checkPayPwdXhr()
        .always(function(){
        })
        .done(function(res) {
          if (res && res.result === 0) {
            //设置了则弹出验证框
            $(document).verifyFundPwd({parentView:self});
          } else if (res && res.result === 1) {
            //未设置则弹出链接到资金密码设置页面的提示框
            $(document).securityTip({
              content: '您未设置资金密码，无法进行银行卡操作',
              showMoneyPwd: true,
              hasMoneyPwd: false,
              showBankCard: false,
              hasBankCard: false
            });
            //self.$('.js-uc-cm-fundPwdSetNotice').removeClass('hidden');
            //self.$el.removeClass('hidden');
          }
        });
  },

  verifySuccCallBack: function(){
    this.changeMainReginView(new CardManageView(), {
      sidebar: 'pc'
    });
    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },
  cardBinding: function() {
    this.changeSubReginView(new CardBindingView(), {
      parentRouter: 'uc/cm'
    });
  },

  priceDetails: function() {
    this.changeMainReginView(new PriceDetailsView(), {
      sidebar: 'pc'
    });

    var PublicView = require('userCenter/views/publicView');
    var publicView = new PublicView();
    publicView.checkState();
  },
  trackBetDetail: function(chaseFormId,tradeNo){
    this.changeSubReginView(new BettingDetailView({
      tradeNo: tradeNo
    }), {
      parentRouter: 'uc/tr'
    });
  }
});

module.exports = UserCenterController;
