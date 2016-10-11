
"use strict";

var config = [
  {
    id: 0,
    zhName: '等待下级同意签约',
    name: 'WAIT'
  },
  {
    id: 1,
    zhName: '<button class="js-ac-modify btn btn-link btn-link-hot">修改签约</button>  <button class="js-ac-see btn btn-link btn-link-hot">查看签约</button>',
    name: 'DONE'
  },
  {
    id: 2,
    zhName: '<button class="js-ac-modify btn btn-link btn-link-hot">发起签约</button>',
    name: 'ADD'
  },

  //{
  //  id: 2,
  //  zhName: '已拒绝',
  //  name: 'PASS'
  //},
  //{
  //  id: 3,
  //  zhName: '申请解约中',
  //  name: 'PASS'
  //},
  //{
  //  id: 4,
  //  zhName: '已经解约',//，本次分红后此协议失效
  //  name: 'PASS'
  //},
  //{
  //  id: 5,
  //  zhName: '<div class="js-ac-break-off-div">拒绝解约，<button class="js-ac-break-off btn btn-link btn-link-hot">再次申请解约</button></div>',
  //  name: 'PASS'
  //},
  //{
  //  id: 6,
  //  zhName: '正在变更',
  //  name: 'PASS'
  //}
];

module.exports = {
  //状态：0申请中，1已签约，2已拒绝，3申请解约中，4已经解约，5拒绝解约，6正在变更
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
