"use strict";

require('./misc/index.scss');

var UserCenterController = require('userCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new UserCenterController(), {
    'uc/pal':'lottoryPal',
    'uc/bac':'baccaratPal',
    'uc/tfr':'transforRecord',
    'uc/br': 'bettingRecords', // 投注信息
    'uc/br/detail/:betId': 'bettingDetail', // 投注详情

    'uc/tr': 'trackRecords', //追号记录
    'uc/tr/detail/:tradeNo': 'trackDetail', //追号记录
    'uc/tr/detail/:chaseTradeNo/detail/:tradeNo': 'trackBetDetail', //追号投注记录

    'uc/rr': 'rechargeRecords',
    'uc/wr': 'withdrawRecords',

    'uc/pm': 'personalManage',
    'uc/cm': 'cardManage', //银行卡管理
    'uc/cm/bind': 'cardBinding',//银行卡绑定
    'uc/pd': 'priceDetails',//奖金详情

    'vip/point': 'vipPoint',
    'vip/level': 'vipLevel',
    'vip/prize': 'vipPrize',
    'vip/cash': 'vipCash',
    //'vip/info': 'vipInfo',
    'vip/credit': 'vipCredit',

  });

};
