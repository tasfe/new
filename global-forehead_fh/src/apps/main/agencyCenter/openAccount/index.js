"use strict";

require('./index.scss');

var TabView = require('com/tabView');

var OpenAccountManualView = require('./manual');
var OpenAccountAutoView = require('./auto');

var OpenAccountView = TabView.extend({

  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json'
    });
  },

  className: 'ac-openAccount-view',

  initialize: function() {

    var acctInfo = Global.memoryCache.get('acctInfo');

   _(this.options).extend({
     tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
     tabs: [
       {
         label: '手动开户',
         name: 'manual',
         id: 'jsAcManualAccount',
         view: OpenAccountManualView
       },
       {
         label: '链接开户',
         name: 'auto',
         id: 'jsAcAutoAccount',
         view: OpenAccountAutoView
       }
     ]
   });
    //招商经理只需要开12.8的账号，去掉链接开户
    if(acctInfo.userGroupLevel === 0) {
      // this.options.tabs = this.options.tabs.slice(0,1);
      this.options.tabs.pop();
    }
    this.subSubAcctXhr = this.getSubAcctXhr();
  },

  renderSuperLimit: function($limit,limitList,isMerchants) {
    var html = [];
    var flag = false;
    // limitList = _(limitList).filter(function(limit) {
    //   return limit.quotaLevel !== 128;
    // });
    if (!_(limitList).isEmpty()) {
      _(limitList).each(function(limit) {
        if(limit.quotaLimit>0){
          flag = true;
        }
        html.push( _(limit.quotaLevel).formatDiv(10,{fixed:1})+'配额&nbsp;'+limit.quotaLimit + '&nbsp;个');
      });
      if(flag) {
        $limit.find('.js-ac-open-limit').html(html.join('，') + '，此后奖金组配额无限制，有配额限制请使用手动开户');
        $limit.removeClass('hidden');
      }
    }
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

module.exports = OpenAccountView;
