define(function (require, exports, module) {

  var FundModifyView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/fundModify.html'),

    events: {},

    getXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/sysusermng/usermoneysection.json',
        data: data
      });
    },

    onRender: function() {
      var self = this;

      self.getXhr({
        superUserId: self.options.userId
      })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('input[name=maxMoney]').val(res.root.maxMoney);
            self.$('input[name=minMoney]').val(res.root.minMoney);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    }
  });

  module.exports = FundModifyView;
});
