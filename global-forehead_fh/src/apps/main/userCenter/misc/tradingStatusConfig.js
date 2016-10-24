"use strict";

var status = [
  {
    index: 'ALL',
    id: '',
    zhName: '全部',
    searchName: '全部'
  },
  {
    index: 'INCOME_ALL',
    id: 10,
    zhName: '收入',
    searchName: '&nbsp;+ 收入'
  },
  {
    index: 'INCOME_CHARGE',
    id: 100,
    zhName: '充值',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>充值'
  },
  {
    index: 'INCOME_WINNING',
    id: 101,
    zhName: '中奖',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>中奖'
  },
  {
    index: 'INCOME_REBATE',
    id: 102,
    zhName: '返点',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>返点'
  },
  {
    index: 'INCOME_CANCEL',
    id: 103,
    zhName: '撤单',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>撤单'
  },
  {
    index: 'INCOME_TRANSFER',
    id: 104,
    zhName: '转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>转账'
  },
  {
    index: 'OUTCOME_TRANSFER',
    id: 111,
    zhName: '转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>转出AG'
  },
  {
    index: 'INCOME_SYSTEM',
    id: 112,
    zhName: 'AG返点',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>AG返点'
  },
  {
    index: 'INCOME_SYSTEM',
    id: 105,
    zhName: '系统加币',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>系统加币'
  },

  {
    index: 'OUTCOME_ALL',
    id: 11,
    zhName: '支出',
    searchName: '&nbsp;- 支出'
  },
  {
    index: 'OUTCOME_WITHDRAW',
    id: 106,
    zhName: '提现',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>提现'
  },
  {
    index: 'OUTCOME_BETTING',
    id: 107,
    zhName: '投注',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>投注'
  },
  {
    index: 'OUTCOME_TRANSFER',
    id: 108,
    zhName: '转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>转账'
  },
  {
    index: 'OUTCOME_TRANSFER',
    id: 110,
    zhName: '转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>转入AG'
  },
  {
    index: 'OUTCOME_SYSTEM',
    id: 109,
    zhName: '系统扣币',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>系统扣币'
  }
];

module.exports = {
  get: function(index) {
    return _(status).getConfig(index);
  },

  toZh: function(id) {
    return _(status).getConfigById(id);
  }
};
