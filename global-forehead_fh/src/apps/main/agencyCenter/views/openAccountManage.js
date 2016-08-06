"use strict";

var TabView = require('com/tabView');

var OpenAccountManageManualView = require('agencyCenter/views/openAccountManage-manual');
var OpenAccountManageAutoView = require('agencyCenter/views/openAccountManage-auto');

var OnlineRechargeView = TabView.extend({

  //template: require('userCenter/templates/priceDetails.html'),

  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json'
    });
  },

  className: 'ac-openAccount-view',

  initialize: function() {
   _(this.options).extend({
     tabs: [
       {
         label: '手动开户',
         name: 'manual',
         id: 'jsAcManualAccount',
         view: OpenAccountManageManualView
       },
       {
         label: '链接开户',
         name: 'auto',
         id: 'jsAcAutoAccount',
         view: OpenAccountManageAutoView
       }
     ]
   });
    this.subSubAcctXhr = this.getSubAcctXhr();
  },

  renderLimit: function($limit,limitList) {
    var html = [];
    var flag = false;
    if (!_(limitList).isEmpty()) {
      _(limitList).map(function(limit) {
        if(limit.quotaLimit>0){
          flag = true;
        }
        html.push( _(limit.quotaLevel).formatDiv(10,{fixed:1})+'配额&nbsp;'+limit.quotaLimit + '&nbsp;个');
      });
      if(flag) {
        $limit.find('.js-ac-open-limit').html(html.join('，') + '。');
        $limit.removeClass('hidden');
      }
    }
  }
});

module.exports = OnlineRechargeView;
