"use scrict";

var RouterController = require('skeleton/controllers/router');

// var BettingRecordView = require('userCenter/bettingRecords');

var BettingRecordView = require('userCenter/bettingRecords/team');
var BettingDetailView = require('userCenter/views/bettingDetail');

// var TrackRecordView = require('userCenter/trackRecords');

var TrackRecordView = require('userCenter/trackRecords/team');
var TrackDetailView = require('userCenter/views/trackDetail');

// var RechargeRecordsView = require('userCenter/rechargeRecords');

var RechargeRecordsView = require('userCenter/rechargeRecords/team');

// var WithdrawRecordsView = require('userCenter/withdrawRecords');
var WithdrawRecordsView = require('userCenter/withdrawRecords/team');


var PersonalManageView = require('userCenter/views/personalManage');
var CardManageView = require('userCenter/views/cardManage');
var CardBindingView = require('userCenter/views/cardBinding');
var PriceDetailsView = require('userCenter/views/priceDetails');

var VipPointView = require('userCenter/vipPoint');
var VipLevelView = require('userCenter/vipLevel');
var VipPrizeView = require('userCenter/vipPrize');
var VipCashView = require('userCenter/vipCash');
//var VipInfoView = require('userCenter/vipInfo');
var VipCreditView = require('userCenter/vipCredit');

var LotteryPALView = require('userCenter/lottoryPAL/ProfitAndLoss');
var BaccaratPalView = require('userCenter/baccaratPal/baccaratPal');
var transforRecordView = require('userCenter/transforRecord/transforRecord');

//var menuConfig = Global.ui.menu.get(['ac', 'uc', 'aa']);

var UserCenterController = RouterController.extend({

  transforRecord:function () {
    this.changeMainReginView(new transforRecordView(), {
      sidebar: Global.ui.menu.get(['uc'])
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },


  baccaratPal:function () {
    this.changeMainReginView(new BaccaratPalView(), {
      sidebar: Global.ui.menu.get(['uc'])
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },
  
  lottoryPal:function () {
    this.changeMainReginView(new LotteryPALView(), {
      sidebar: Global.ui.menu.get(['uc'])
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
      sidebar: Global.ui.menu.get(['uc'])
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
      sidebar: Global.ui.menu.get(['uc'])
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  trackRecords: function() {
    this.changeMainReginView(new TrackRecordView(), {
      sidebar: Global.ui.menu.get(['uc'])
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
      sidebar: Global.ui.menu.get(['uc'])
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  withdrawRecords: function() {
    this.changeMainReginView(new WithdrawRecordsView(), {
      sidebar: Global.ui.menu.get(['uc'])
    });
    $('#main > .clearfix').addClass('ac-block ac-block2');
  },

  vipPoint:function() {
    this.changeMainReginView(new VipPointView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });

  },

  vipLevel:function() {
    this.changeMainReginView(new VipLevelView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });

  },
  vipPrize:function() {
    this.changeMainReginView(new VipPrizeView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });

  },
  vipCash:function() {
    this.changeMainReginView(new VipCashView(), {
      sidebar: Global.ui.menu.get(['pc','vip'])
    });

  },
  //vipInfo:function() {
  //  this.changeMainReginView(new VipInfoView(), {
  //    sidebar: Global.ui.menu.get(['pc','vip'])
  //  });
  //
  //},
  vipCredit:function() {
  this.changeMainReginView(new VipCreditView(), {
    sidebar: Global.ui.menu.get(['pc','vip'])
  });

},

  personalManage: function() {
    this.changeMainReginView(new PersonalManageView(), {
      sidebar: Global.ui.menu.get(['pc'])
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
      sidebar: Global.ui.menu.get(['pc'])
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
      sidebar: Global.ui.menu.get(['pc'])
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
