define(function (require, exports, module) {

  var RouterController = require('skeleton/controllers/router');

  var VipLevelIntegralView = require('vipCenter/vipLevelManagement/vipLevelIntegral');
  var VipLevelMapView = require('vipCenter/vipLevelManagement/vipLevelMap');
  var VipLevelWelfareView = require('vipCenter/vipLevelManagement/vipLevelWelfare');
  var VipLevelEntryView = require('vipCenter/vipLevelManagement/vipLevelEntrySet');

  var VipChangeRecordView = require('vipCenter/vipChangeManagement/vipChangeRecord');

  var VipWelfareGiftsView = require('vipCenter/vipWelfareManagement/vipWelfareGifts');
  var VipWelfareAwardView = require('vipCenter/vipWelfareManagement/vipWelfareAward');
  var VipWelfareRepayView = require('vipCenter/vipWelfareManagement/vipWelfareRepay');
  var VipWelfareApplyView = require('vipCenter/vipWelfareManagement/vipWelfareApply');

  var VipIntegralRecordView = require('vipCenter/vipIntegralManagement/vipIntegralRecord');

  var VipCenterController = RouterController.extend({
    vipLevelIntegralView: function() {
      this.changeMainReginView(new VipLevelIntegralView());
    },
    vipLevelMapView: function() {
      this.changeMainReginView(new VipLevelMapView());
    },
    vipLevelWelfareView: function() {
      this.changeMainReginView(new VipLevelWelfareView());
    },
    vipChangeRecordView: function() {
      this.changeMainReginView(new VipChangeRecordView());
    },
    vipWelfareGiftsView: function() {
      this.changeMainReginView(new VipWelfareGiftsView());
    },
    vipWelfareAwardView: function() {
      this.changeMainReginView(new VipWelfareAwardView());
    },
    vipWelfareRepayView: function() {
      this.changeMainReginView(new VipWelfareRepayView());},
    vipLevelEntrySetView: function() {
      this.changeMainReginView(new VipLevelEntryView());
    },
    vipWelfareApplyView: function() {
      this.changeMainReginView(new VipWelfareApplyView());
    },
    vipIntegralRecord: function() {
      this.changeMainReginView(new VipIntegralRecordView());
    }
  });

  module.exports = VipCenterController;

});