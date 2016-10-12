"use strict";

var config = [
  {
    id: 1,
    zhName: '招商直属',
    name: 'TOP',
    status: [
      {
        id: 0,
        zhName: '领取分红',
        type: 'button',
        loadingText: '申请中'
      },
      {
        id: 1,
        zhName: '已发放'
      },
      {
        id: 2,
        zhName: '不发放'
      },
      {
        id: 3,
        zhName: '申请发放中'
      },
      {
        id: 9,
        zhName: '统计中'
      }
    ]
  },
  {
    id: 2,
    zhName: '代理',
    name: 'LEVEL_ONE',
    status: [
      {
        id: 0,
        zhName: '等待上级发放'
      },
      {
        id: 1,
        zhName: '已发放'
      },
      {
        id: 2,
        zhName: '不发放'
      },
      {
        id: 9,
        zhName: '统计中'
      }
    ]
  }
];

module.exports = {
  getByName: function(name) {
    return _(config).findWhere({
      name: name
    }) || {};
  }
};
