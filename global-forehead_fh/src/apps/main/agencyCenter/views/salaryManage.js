"use strict";

var TabView = require('com/tabView');

var SalaryManageMyView = require('agencyCenter/views/salaryManage-my');
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
         label: '我的日工资',
         name: 'my',
         id: 'jsSalaryManageMy',
         view: SalaryManageMyView
       },
       {
         label: '下级签约日工资',
         name: 'auto',
         id: 'jsAcAutoAccount',
         view: OpenAccountManageAutoView
       },
       {
         label: '下级签约管理',
         name: 'auto',
         id: 'jsAcAutoAccount',
         view: OpenAccountManageAutoView
       }
     ]
   });
    this.subSubAcctXhr = this.getSubAcctXhr();
  }
});

module.exports = OnlineRechargeView;
