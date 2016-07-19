var trackStatus = [
  {
    index: 'ALL',
    id: -1,
    zhName: '全部'
  },
  {
    index: 'BEFORE_RUN',
    id: 0,
    zhName: '未开始'
  },
  {
    index: 'RUNNING',
    id: 1,
    zhName: '进行中'
  },
  {
    index: 'END',
    id: 2,
    zhName: '已完成'
  },
  {
    index: 'CANCEL',
    id: 3,
    zhName: '已中止'
  }
];

module.exports = {
  get: function(index) {
    return _(trackStatus).getConfig(index);
  },

  toZh: function(id) {
    return _(trackStatus).getConfigById(id);
  }
};
