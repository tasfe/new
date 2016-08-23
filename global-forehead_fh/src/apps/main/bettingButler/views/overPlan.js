"use strict";

var overPlan = Base.ItemView.extend({

   template: require('bettingButler/templates/overPlan.html'),

   startOnLoading: true,

   events: {
       'click .js-list-active': 'activeChangeHandler'
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