"use strict";

require('./index.scss');


var AgTransferView = Base.ItemView.extend({

  template: require('./agTransform.html'),

  startOnLoading: true,

  events: {
    'click .js-ag-submitTransfer': 'submitTransferHandler',
    'click .js-ag-switchBtn': 'switchHandler'
  },

  onRender: function() {
    var self = this;
    this.$lotteryBalance = this.$('.js-cp-balance');
    this.$agBalance = this.$('.js-ag-balance');

    this.$transAmount = this.$('.js-agTransfer-amount');
    this.transType = this.$('.js-ag-switchBtn');

    self.loadUserBalance();
  },
  switchHandler: function(e) {

    if($(e.currentTarget).data('switch') === '1') {
      $(e.currentTarget).data('switch', '2');

      this.$('.js-lt-account').html('AG账户');
      this.$('.js-ag-account').html('彩票账户（主账户）');

    } else {
      $(e.currentTarget).data('switch', '1');

      this.$('.js-lt-account').html('彩票账户（主账户）');
      this.$('.js-ag-account').html('AG账户');
    }

  },
  loadUserBalance: function() {
    var self = this;
    Global.sync.ajax({
      url: '/acct/userinfo/getUserBalance.json'
    }).always(function() {
      self.loadingFinish();
    })
      .done(function(res) {
        var data = res.root || {};
        if(res && res.result === 0) {
          self.$lotteryBalance.html(_(data.lotteryBalance).fixedConvert2yuan());
          self.$agBalance.html(_(data.agBalance).fixedConvert2yuan());
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },
  submitTransferHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    $target.button('loading');
    Global.sync.ajax({
      url: '/fund/transfer/agTransfer.json',
      data: {
        'transferType': self.transType.data('switch'),
        'tradeMoney': self.$transAmount.val()
      }
    }).always(function() {
      $target.button('reset');
    })
      .done(function(res) {
        //var data = res.root || {};
        if(res && res.result === 0) {
          self.options.parentView.closeDialog();
          Global.ui.notification.show('转账成功');
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  }
});

module.exports = AgTransferView;
