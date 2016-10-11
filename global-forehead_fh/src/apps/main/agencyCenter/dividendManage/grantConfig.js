"use strict";

var config = [
  {
    id: 0,
    zhName: '<span style="color: #c60511">未发放</span>',
    name: 'WAIT',
    classStr: 'text-hot'
  },
  {
    id: 1,
    zhName: '<span style="color: #949494">已发放</span>',
    name: 'DONE',
    classStr: ''
  },
  {
    id: 2,
    zhName: '<span style="color: #949494">不发放</span>',
    name: 'PASS',
    classStr: ''
  },
  {
    id: 9,
    zhName: '<span style="color: #ffaa4d">统计中</span>',
    name: 'STATISTIC',
    classStr: 'text-sunshine'
  }
];

module.exports = {
  getByName: function(name) {
    return _(config).findWhere({
        name: name
      }) || {};
  },

  getZh: function(id) {
    return _(config).getConfigById(id);
  },

  getAll: function() {
    return config;
  }
};
