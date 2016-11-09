"use strict";

// var config = require('com/newrecharge/config');

var RedPacket = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
  },

  getServiceXhr:function () {
      return Global.sync.ajax({
          url: '/info/moneytreeactivity/info.json',
          data: {
              activityId: this.options.activityId
          }
      });
  },

  initialize: function() {
      var self = this;
      require.ensure(['./index.scss'], function (require) {
          require('./index.scss');

      });
  },

   onRender: function() {
       var self = this;
       this.$modeTextNum = this.$(".js_mode_text_num");
       this.$activityTime = this.$(".js_activity_time");
       this.getServiceXhr()
           .done(function (res) {
               if(res.result === 0){
                   var sTime = _(res.root.fromDate).toTime('MM月DD日 H:mm:ss');
                   var eTime = _(res.root.endDate).toTime('MM月DD日 H:mm:ss');
                   var condition = _.formatDiv(res.root.limit,10000);
                   self.$activityTime.html(sTime + ' - - ' + eTime);
                   self.$modeTextNum.html(condition);
               }
           });
   }
});

module.exports = RedPacket;
