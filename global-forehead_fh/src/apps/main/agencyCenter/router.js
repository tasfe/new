"use strict";

require('./misc/index.scss');
var FundCenterController = require('agencyCenter/controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new FundCenterController(), {
    'ac/llm': 'lowLevelManage', //下级管理
    'ac/salary': 'salaryManage',//日工资管理
    'ac/llm/rebate/:userId': 'rebateManage', //升点(返点)管理

    'ac/llm/detail/:userId': 'lowLevelDetail', //下级管理详情

    'ac/llm/message/:userId': 'sendMessage', //发消息
    'ac/llm/transfer/:userId': 'transfer', //转账
    'ac/oam': 'openAccountManage', //开户
    'ac/oam/pd/:ticket': 'openAccountManagePrice',
    'ac/rm': 'reportManage', //报表查询
    'ac/rm/br/:tabName': 'bettingRecords4Report', //投注记录
    'ac/td': 'teamDynamic',

    //'ac/pl': 'profitAndLoss', //报表查询

    'ac/betting/:userId/:tabName': 'bettingRecords', //投注
    'ac/track/:userId/:tabName': 'trackRecords', //追号
    'ac/account/:userId/:tabName': 'accountDetail', //账变
    'ac/betting/:userId/:tabName/detail/:betId': 'bettingDetail', //投注详情
    'ac/track/:userId/:tabName/detail/:tradeNo': 'trackDetail', //追号详情

    'ac/dm': 'dividendManage', //分红管理
    'ac/rp': 'redPacket', //红包查询,
    'ac/cs': 'commissionStatistics',
    'ac/rm/rr/:tabName': 'rechargeRecords4Report', //充值记录
    'ac/rm/wr/:tabName': 'withdrawRecords4Report', //提现记录
   // 'ac/rm/ar/:userId': 'activeRecords4Report', //活动记录
    'ac/rr': 'rushReward'

  });
};
