"use strict";

var TabView = require('com/tabView');

var SalaryManageMyView = require('agencyCenter/views/salaryManage-my');
var SalaryManageLowLevelView = require('agencyCenter/views/salaryManage-lowLevel');
var SalaryManageLowLevelView2 = require('agencyCenter/views/salaryManage-lowLevel2');

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
         name: 'lS1',
         id: 'jsSalaryManageLowLevelView',
         view: SalaryManageLowLevelView
       },
       {
         label: '下级签约管理',
         name: 'lS2',
         id: 'jsSalaryManageLowLevelView2',
         view: SalaryManageLowLevelView2
       }
     ]
   });
    this.subSubAcctXhr = this.getSubAcctXhr();
  }
});

module.exports = OnlineRechargeView;
