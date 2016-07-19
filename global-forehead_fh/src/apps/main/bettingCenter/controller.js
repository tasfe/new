"use strict";

require('./misc/index.scss');

var RouterController = require('skeleton/controllers/router');

var BettingCenterView = require('bettingCenter/views/bettingCenter');

var BettingDetailView = require('bettingCenter/views/bettingCenter-detail');

var MMCBettingCenterView = require('bettingCenter/mmc');

var SMMCBettingCenterView = require('bettingCenter/smmc');

var BettingCenterController = RouterController.extend({

  bettingCenter: function(ticketId) {
    if(Number(ticketId)===19){
      this.changeMainReginView(new MMCBettingCenterView({
        ticketId: Number(ticketId)
      }));
    }else if(Number(ticketId)===20){
      this.changeMainReginView(new SMMCBettingCenterView({
        ticketId: Number(ticketId)
      }));
    }else{
      this.changeMainReginView(new BettingCenterView({
        ticketId: Number(ticketId)
      }));
    }

  }

  //bettingDetail: function(ticketId, tradeNo) {
  //  this.changeMainReginView(new BettingDetailView({
  //    tradeNo: tradeNo
  //  }), {
  //    main: {
  //      title: '投注详情',
  //      subReturn: true
  //    },
  //    entry: false,
  //    sidebar: Global.ui.menu.get(['ac', 'uc', 'aa']),
  //    parentRouter: 'bc/' + ticketId
  //  });
  //}
});

module.exports = BettingCenterController;
