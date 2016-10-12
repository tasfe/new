"use strict";

require('./misc/index.scss');

var UserCenterController = require('userCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new UserCenterController(), {
    'uc/br': 'gameRecords', // 游戏记录
    'uc/br/detail/:betId': 'bettingDetail', // 投注详情
    'uc/tr': 'trackRecords', //追号记录
    'uc/tr/detail/:tradeNo': 'trackDetail', //追号记录
    'uc/tr/detail/:chaseTradeNo/detail/:tradeNo': 'trackBetDetail', //追号投注记录

    'uc/pal': 'profitAndLoss', // 盈亏报表
    'uc/md': 'moneyDetail', // 账变明细
    'uc/pd': 'priceDetails',//奖金详情

    'uc/cm': 'cardManage', //银行卡管理
    'uc/cm/bind': 'cardBinding',//银行卡绑定


    // 'ac/rm': 'reportManage', //报表查询(彩票盈亏)
    // 'uc/tfr':'transforRecord',

    'vip/point': 'vipPoint',
    'vip/level': 'vipLevel',
    'vip/prize': 'vipPrize',
    'vip/cash': 'vipCash',
    //'vip/info': 'vipInfo',
    'vip/credit': 'vipCredit'

  });

};
