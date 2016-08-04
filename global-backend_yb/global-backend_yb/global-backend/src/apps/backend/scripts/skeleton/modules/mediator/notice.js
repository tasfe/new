define(function(require, exports, module) {

  var NoticeModel = require('skeleton/models/notice');

  var NoticeMediatorModule = Base.Module.extend({

    startWithParent: false,

    interval: 10000,

    initialize: function() {
      this.model = Global.data.set('noticeModel', new NoticeModel());
    },

    onStart: function() {
      var self = this;
      Global.polling.start('notice:request', function() {

        var letterXhr = Global.sync.ajax({
          url: '/intra/monitor/info.json'
          //url: '/acct/test.json'
        })
          .always(function() {
            Global.polling.next('notice:request', {
              interval: self.interval
            });
          })
          .done(function(res) {

            self.model.set(res.root, {
              parse: true
            });

            Global.m.publish('notice:updating',  self.model);
          });
      });
    },

    onStop: function() {
      Global.polling.stop('notice:request');
    }
  });

  module.exports = NoticeMediatorModule;
});
