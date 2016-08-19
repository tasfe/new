"use strict";

var TabView = require('com/tabView');

var ApplyView = require('./apply');
var ApplyRecordView = require('./applyRecord');
var RefundRecordView = require('./refundRecord');

var VipCreditView = TabView.extend({

  //className: 'ac--view',

  initialize: function() {
    _(this.options).extend({
      tabClass:'vip-tab',
      tabs: [
        {
          label: '提交申请',
          name: 'apply',
          id: 'jsApply',
          view: ApplyView
        },
        {
          label: '申请记录',
          name: 'applyRecord',
          id: 'jsApplyRecord',
          view: ApplyRecordView
        },
        {
          label: '还款记录',
          name: 'refundRecord',
          id: 'jsRefundRecord',
          view: RefundRecordView
        }
      ]
    });
  }
});

module.exports = VipCreditView;
