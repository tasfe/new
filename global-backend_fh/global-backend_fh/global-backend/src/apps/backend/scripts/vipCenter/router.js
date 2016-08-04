define(function(require, exports, module) {

  var VipCenterController = require('vipCenter/controller');

  exports.install = function() {

    window.Global.appRouter.processAppRoutes(new VipCenterController(), {
        'vip/il':'vipLevelIntegralView',
        'vip/mp':'vipLevelMapView',
        'vip/we':'vipLevelWelfareView',
        'vip/rd':'vipChangeRecordView',
        'vip/gs':'vipWelfareGiftsView',
        'vip/ad':'vipWelfareAwardView',
        'vip/ry':'vipWelfareRepayView',
        'vip/me':'vipLevelEntrySetView',
        'vip/ap':'vipWelfareApplyView',
        'vip/tl':'vipIntegralRecord'
     /* '#vip/we':'vipLevelWelfareView',

      '#vip/rd':'vipChangeRecordView',
      '#vip/st':'vipChangeSetView',

      '#vip/gs':'vipWelfareGiftsView',
      '#vip/ad':'vipWelfareAwardView',
      '#vip/ap':'vipWelfareApplyView',
      '#vip/ry':'vipWelfareRepayView',

      '#vip/tl':'vipIntegralTotalView'*/

    });

  };

});