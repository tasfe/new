"use scrict";

var RouterController = require('skeleton/controllers/router');
var BettingDetailView = require('userCenter/bettingDetail');

var TrackDetailView = require('userCenter/chaseDetail');

var GameRecordsView = require('userCenter/gameRecords');
var MoneyDetailView = require('userCenter/moneyDetail');
var ProfitAndLossView = require('userCenter/profitAndLoss');

var CardManageView = require('userCenter/views/cardManage');
var PriceDetailsView = require('userCenter/views/priceDetails');

var VipPointView = require('userCenter/vipPoint');
var VipLevelView = require('userCenter/vipLevel');
var VipPrizeView = require('userCenter/vipPrize');
var VipCashView = require('userCenter/vipCash');
var VipCreditView = require('userCenter/vipCredit');


var ReportManageView = require('agencyCenter/reportManage/teamReport');

var UserCenterController = RouterController.extend({

  gameRecords: function(type) {
    this.changeMainReginView(new GameRecordsView({
      triggerTab: type
    }), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  bettingDetail: function(tradeNo) {
    this.changeSubReginView(new BettingDetailView({
      tradeNo: tradeNo,
      quickEntry: true
    }), {
      parentRouter: 'gr/br',
      main: {
        subReturn: true
      },
      // sidebar: 'pc',
      topView: 'personal'
    });
  },

  trackDetail: function(tradeNo) {
    this.changeSubReginView(new TrackDetailView({
      tradeNo: tradeNo
    }), {
      parentRouter: 'gr/tr',
      main: {
        subReturn: true
      },
      // sidebar: 'pc',
      topView: 'personal'
    });
  },

  reportManage: function() {
    this.changeMainReginView(new ReportManageView(), {
      sidebar: 'uc'
    });
  },

  vipPoint: function() {
    this.changeMainReginView(new VipPointView(), {
      sidebar: 'vip'
    });
  },

  vipLevel: function() {
    this.changeMainReginView(new VipLevelView(), {
      sidebar: 'vip'
    });
  },
  vipPrize: function() {
    this.changeMainReginView(new VipPrizeView(), {
      sidebar: 'vip'
    });
  },
  vipCash: function() {
    this.changeMainReginView(new VipCashView(), {
      sidebar: 'vip'
    });
  },
  vipCredit: function() {
    this.changeMainReginView(new VipCreditView(), {
      sidebar: 'vip'
    });
  },

  cardManage: function() {

    var self = this;
    Global.m.states.check()
      .once('check:complete', function(model) {
        var hasMoneyPwd = model.get('hasMoneyPwd');
        if (model.get('hasMoneyPwd')) {
          self.changeMainReginView(new CardManageView(), {
            sidebar: 'pc',
            topView: 'personal'
          });
        } else {
          $(document).securityTip({
            content: '您未设置资金密码，无法进行银行卡操作',
            showMoneyPwd: true,
            hasMoneyPwd: false,
            showBankCard: false,
            hasBankCard: false
          });
        }
      });
    // this.checkPayPwdXhr()
    //   .done(function(res) {
    //     if(res && res.result === 0) {
    //       //设置了则弹出验证框
    //       $(document).verifyFundPwd({
    //         onValidated: function() {
    //         }
    //       });
    //     } else if(res && res.result === 1) {
    //       //未设置则弹出链接到资金密码设置页面的提示框
    //     }
    //   });
  },

  priceDetails: function() {
    this.changeMainReginView(new PriceDetailsView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  moneyDetail: function() {
    this.changeMainReginView(new MoneyDetailView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  },

  profitAndLoss: function() {
    this.changeMainReginView(new ProfitAndLossView(), {
      sidebar: 'pc',
      topView: 'personal'
    });
  }
});

module.exports = UserCenterController;
