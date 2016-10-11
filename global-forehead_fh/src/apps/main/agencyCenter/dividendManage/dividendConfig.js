"use strict";

var config = [
  {
    id: 0,
    zhName: '未开通',
    name: 'UN_APPLIED'
  },
  {
    id: 1,
    zhName: '申请中',
    name: 'APPLYING'
  },
  {
    id: 2,
    zhName: '已开通',
    name: 'APPLIED'
  }
  //0申请中，1已签约，2已拒绝，3申请解约中，4已经解约，5拒绝解约，6正在变更
];

module.exports = {
  getByName: function(name) {
    return _(config).findWhere({
      name: name
    }) || {};
  }
};
