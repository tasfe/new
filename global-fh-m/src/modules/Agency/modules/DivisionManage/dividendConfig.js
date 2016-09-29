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
];

module.exports = {
  getByName: function(name) {
    return _(config).findWhere({
      name: name
    }) || {};
  }
};
