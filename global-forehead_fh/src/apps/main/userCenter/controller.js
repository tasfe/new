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
        if (model.get('hasMoneyPwd')) {
          $(document).verifyFundPwd({
            onValidated: function() {
              self.changeMainReginView(new CardManageView(), {
                sidebar: 'pc',
                topView: 'personal'
              });
            }
          });
        } else {
          $(document).securityTip({
            content: '请补全您的安全信息后在绑定银行卡',
            hasMoneyPwd: false,
            showBankCard: false,
            showSecurity: false
          });
        }
      });
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
