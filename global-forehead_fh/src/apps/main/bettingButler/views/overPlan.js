"use strict";
var TabView = require('com/tabView');
var BettingChoiceModel = require('bettingCenter/models/bettingChoice-mmc');
var BettingRulesCollection = require('bettingCenter/collections/bettingRules');
var PlayAreaSelectView = require('bettingCenter/views/bettingCenter-playArea-select');
var PlayAreaInputView = require('bettingCenter/views/bettingCenter-playArea-input');
var BettingRecordsView = require('bettingCenter/views/bettingCenter-records');

var ticketConfig = require('skeleton/misc/ticketConfig');
var betRulesConfig = require('bettingCenter/misc/betRulesConfig');
var overPlan = Base.ItemView.extend({
   template: require('bettingButler/templates/overPlan.html'),
   startOnLoading: true,
   events: {
       'click .js-list-active': 'activeChangeHandler',
       'click .js-new-plan-content': 'addPlan'
   },

    addPlan:function(){
        $('.js-new-plan-content').click(function(){
                $('.js-reward-grid').append('<tr><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td><td>'+1+'</td></td><td class="js-delete-tr">'+'删除'+'</td></tr>');

        });
        $('.js-delete-tr').click(function(){
            $(this).parent().remove();
        });
    },
   onRender: function() {

       var self = this;

       self.loadingFinish();
       
       
       

   },

   renderActiveGrid: function(pageIndex) {
       var self = this;
       this.$activeContext.empty();
       this.getActiveXhr({
               pageSize: 10,
               pageIndex: pageIndex,
               type:type
           })
           .always(function() {
               self.loadingFinish();
           })
           .done(function(res) {
               var data = res.root || {};
               if (res && res.result === 0) {


               } else {
                   Global.ui.notification.show('加载失败，请稍后再试');
               }
           });
   },

   getEmptyHtml: function(emptyTip) {
       var html = [];
       if (emptyTip) {
           html.push('<div class="js-wt-empty-container empty-container text-center">');
           html.push('<div class="empty-container-main">');
           html.push('<div class="sfa-grid-empty"></div>');
           html.push(emptyTip);
           html.push('</div>');
           html.push('</div>');
       }

       return html.join('');
   }
});

module.exports = overPlan;