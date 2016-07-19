var betStatus = [
  {
    index: 'ALL',
    id: -1,
    zhName: '全部'
  },
  {
    index: 'BEFORE_RUN',
    id: 0,
    zhName: '等待开奖'
  },
  {
    index: 'WINNING',
    id: 1,
    zhName: '已中奖'
  },
  {
    index: 'I_CANCEL',
    id: 2,
    zhName: '用户撤单'
  },
  {
    index: 'P_CANCEL',
    id: 3,
    zhName: '系统撤单'
  },
  {
    index: 'DON_NOT_WIN',
    id: 4,
    zhName: '未中奖'
  }
];

module.exports = {
  get: function(index) {
    return _(betStatus).getConfig(index);
  },

  toZh: function(id) {
    return _(betStatus).getConfigById(id);
  }
};
