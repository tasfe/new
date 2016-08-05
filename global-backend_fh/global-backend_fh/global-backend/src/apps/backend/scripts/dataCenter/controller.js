define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var AgencyProfitAndLossReportView = require('dataCenter/views/agencyProfitAndLossReport');
  var ProfitAndLossReportView = require('dataCenter/views/profitAndLossReport');
  var RechargeAndWithdrawReportView = require('dataCenter/views/rechargeAndWithdrawReport');
  var TransferReportView = require('dataCenter/views/transferReport');
  var TicketProfitAndLossReportView = require('dataCenter/views/ticketProfitAndLossReport');
  var PlayProfitAndLossReportView = require('dataCenter/views/playProfitAndLossReport');
  var BalanceReportView = require('dataCenter/views/balanceReport');

  var DataCenterController = RouterController.extend({

    agencyProfitAndLossReport: function() {
      this.changeMainReginView(new AgencyProfitAndLossReportView());
    },
    profitAndLossReport: function() {
      this.changeMainReginView(new ProfitAndLossReportView());
    },
    rechargeAndWithdrawReport: function() {
      this.changeMainReginView(new RechargeAndWithdrawReportView());
    },
    transferReport: function() {
      this.changeMainReginView(new TransferReportView());
    },
    ticketProfitAndLossReport: function() {
      this.changeMainReginView(new TicketProfitAndLossReportView());
    },
    playProfitAndLossReport: function() {
      this.changeSubReginView(new PlayProfitAndLossReportView({
      }), {
        parentRouter: 'dc/lt'
      });
    },
    balanceReport: function(){
      this.changeMainReginView(new BalanceReportView());
    }

  });

  module.exports = DataCenterController;

});