"use strict";

require('./misc/index.scss');

var UserCenterController = require('userCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new UserCenterController(), {
    'gr/:type': 'gameRecords', // 游戏记录

    'gr/br/detail/:betId': 'bettingDetail', // 投注详情
    'gr/tr/detail/:tradeNo': 'trackDetail', //追号记录

    'uc/pal': 'profitAndLoss', // 盈亏报表
    'uc/md': 'moneyDetail', // 账变明细
    'uc/pd': 'priceDetails',//奖金详情

    'uc/cm': 'cardManage' //银行卡管理

    // 'vip/point': 'vipPoint',
    // 'vip/level': 'vipLevel',
    // 'vip/prize': 'vipPrize',
    // 'vip/cash': 'vipCash',
    // 'vip/credit': 'vipCredit'

  });

};
