
"use strict";

var config = [
  {
    id: 0,
    zhName: '<span style="color: #d21e1e">未签约</span>',
    operate: '<button class="js-ac-sponsor btn btn-link btn-link-hot ac-sm-um-btn">发起签约</button>',
    name: 'WAIT'
  },
  {
    id: 1,
    zhName: '已签约',
    operate: '<button class="js-ac-modify btn btn-link btn-link-hot ac-sm-um-btn">修改签约</button><button class="js-ac-sm-watch btn btn-link btn-link-hot  ac-sm-um-btn">查看签约</button>',//<button class="js-ac-break-off btn btn-link btn-link-hot">申请解约</button>
    name: 'DONE'
  }
  //,{
  //  id: 2,
  //  zhName: '已拒绝',
  //  operate: '',
  //  name: 'PASS'
  //},
  //{
  //  id: 3,
  //  zhName: '签约失败',
  //  operate: '',
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

  getOperate: function(id) {
    return _(config).find(function(item){
      return item.id == id;
    }).operate;
  },

  getAll: function() {
    return config;
  }
};
