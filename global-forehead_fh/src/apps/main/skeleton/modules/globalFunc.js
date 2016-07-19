"use strict";

//中间者启动必要文件,用于配置权限等

var GlobalFuncModule = Base.Module.extend({

  startWithParent: false,

  initialize: function() {
    _.mixin({
      checkBettingStatus: function(bet) {
        //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单 4: 未开始,ticketResult,prizeTotalMoney
        //betStatus, hasException, openNumbers, openStatus, prized, prizeTotalMoney
        var status = '';
        if(bet.ticketPlanId==='mmc'){
          if (bet.prizeTotalMoney > 0) {
            status = '<span class="' + bet.prizeClass + '">' + _(bet.prizeTotalMoney).convert2yuan() + '</span>';
          }else{
            status = '未中奖';
          }
        }else{
          if (bet.betStatus === 4) {
            status = '未开始';
          } else if (bet.betStatus === 2) {
            status = '用户撤单';
          } else if (bet.betStatus === 3) {
            status = '系统撤单';
          } else if (bet.hasException) {
            status = '等待开奖';
          } else if (bet.openNumbers === null) {
            if (bet.openStatus > 0) {
              status = '未中奖';
            } else {
              status = '等待开奖';
            }
          } else if (bet.prizeTotalMoney > 0) {
            status = '<span class="' + bet.prizeClass + '">' + _(bet.prizeTotalMoney).convert2yuan() + '</span>';
          } else if (bet.prizing && bet.betTime > 1457328600000) {
            status = '正在开奖';
          } else if (bet.prizeTotalMoney === 0) {
            status = '未中奖';
          }
        }

        return status;
      }
    });
  }
});

module.exports = GlobalFuncModule;
