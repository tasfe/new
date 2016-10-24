define(function(require, exports, module) {

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
      searchName: ' + 收入'
    },
    {
      index: 'INCOME_CHARGE',
      id: 100,
      zhName: '充值',
      searchName: '    >充值'
    },
    {
      index: 'INCOME_WINNING',
      id: 101,
      zhName: '中奖',
      searchName: '    >中奖'
    },
    {
      index: 'INCOME_REBATE',
      id: 102,
      zhName: '返点',
      searchName: '    >返点'
    },
    {
      index: 'INCOME_CANCEL',
      id: 103,
      zhName: '撤单',
      searchName: '    >撤单'
    },
    {
      index: 'INCOME_TRANSFER',
      id: 104,
      zhName: '上级转账',
      searchName: '    >上级转账'
    },
          {
              index: 'OUTCOME_TRANSFER',
              id: 111,
              zhName: '转账',
              searchName: '    >转出AG'
          },
          {
              index: 'INCOME_TRANSFER',
              id: 112,
              zhName: '返点',
              searchName: '    >AG返点'
          },
    {
      index: 'INCOME_SYSTEM',
      id: 105,
      zhName: '系统加币',
      searchName: '    >系统加币'
    },
    {
      index: 'OUTCOME_ALL',
      id: 11,
      zhName: '收入',
      searchName: '－ 收入'
    },
    {
      index: 'OUTCOME_WITHDRAW',
      id: 106,
      zhName: '提现',
      searchName: '    >提现'
    },
    {
      index: 'OUTCOME_BETTING',
      id: 107,
      zhName: '投注',
      searchName: '    >投注'
    },
    {
      index: 'OUTCOME_TRANSFER',
      id: 108,
      zhName: '下级转账',
      searchName: '    >下级转账'
    },
    {
              index: 'OUTCOME_TRANSFER',
              id: 110,
              zhName: '转账',
              searchName: '    >转入AG'
    },
    {
      index: 'OUTCOME_SYSTEM',
      id: 109,
      zhName: '系统扣币',
      searchName: '    >系统扣币'
    }
  ];

  return {
    get: function(index) {
      return _(status).getConfig(index);
    },

    toZh: function(id) {
      return _(status).getConfigById(id);
    }
  };
});
