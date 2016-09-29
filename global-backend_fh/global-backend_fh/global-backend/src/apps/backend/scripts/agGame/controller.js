define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var AgUserDetailView = require('agGame/userManagement/ag-userList');
  var AgBetRecordView = require('agGame/betManagement/ag-BettingRecord');
  var AgSysSetView = require('agGame/agSetManagement/ag-systemSet');
  var AgProfitAndLossReportView = require('agGame/dataManagement/agProfitAndLossReport');
  var AgRechargeSetView = require('agGame/amountManagement/ag-rechargeSet');
  var AgRechargeReportView = require('agGame/amountManagement/ag-rechargeReport');
  var AgRebateSetView = require('agGame/amountManagement/ag-rebateSet');

  var AgGameController = RouterController.extend({
    agUserDetailView: function() {
      this.changeMainReginView(new AgUserDetailView());
    },
    agBetRecordView: function() {
      this.changeMainReginView(new AgBetRecordView());
    }
    ,
    agSysSetView: function() {
      this.changeMainReginView(new AgSysSetView());
    },
    agProfitAndLossReport: function() {
      this.changeMainReginView(new AgProfitAndLossReportView());
    },
    agRechargeSetView: function() {
      this.changeMainReginView(new AgRechargeSetView());
    },
    agRechargeReportView: function() {
      this.changeMainReginView(new AgRechargeReportView());
    },
    agRebateSetView: function() {
      this.changeMainReginView(new AgRebateSetView());
    }
  });

  module.exports = AgGameController;

});