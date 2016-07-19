
"use strict";

var config = [
  {
    id: 0,
    zhName: '等待下级同意签约',
    name: 'WAIT'
  },
  {
    id: 1,
    zhName: '<button class="js-ac-break-off btn btn-link btn-link-pleasant">申请解约</button>',
    name: 'DONE'
  },
  {
    id: 2,
    zhName: '已拒绝',
    name: 'PASS'
  },
  {
    id: 3,
    zhName: '审核中',
    name: 'PASS'
  },
  {
    id: 4,
    zhName: '已通过，本次分红后此协议失效',
    name: 'PASS'
  },
  {
    id: 5,
    zhName: '解约失败，<button class="js-ac-break-off btn btn-link btn-link-pleasant">再次申请解约</button>',
    name: 'PASS'
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
