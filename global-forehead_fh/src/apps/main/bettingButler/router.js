"use strict";

var bettingButlerController = require('./controller');

exports.install = function() {

  window.Global.appRouter.processAppRoutes(new bettingButlerController(), {
    'bb/sp': 'butlerSetPlan',//设置计划
    'bb/rp': 'butlerRunPlan',//进行中的计划
    'bb/cp': 'butlerColPlan' //我的收藏方案
  });
};
