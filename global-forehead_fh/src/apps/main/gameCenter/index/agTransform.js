"use strict";

require('./index.scss');


var AgTransferView = Base.ItemView.extend({

  template: require('./agTransform.html'),

  startOnLoading: true,

  events: {
    'submit .js-ag-transfer-form': 'submitTransferHandler',
    'click .js-ag-switchBtn': 'switchHandler'
  },

  getUserBalanceXhr: function() {
    return Global.sync.ajax({
      url: '/acct/userinfo/getUserBalance.json'
    });
  },

  onRender: function() {
    var self = this;

    this.$switch = this.$('.js-ag-switchBtn');

    this.$lotteryBalance = this.$('.js-cp-balance');
    this.$agBalance = this.$('.js-ag-balance');
    this.$agLimit = this.$('.js-ag-limit');
    this.$transferMin = this.$('.js-ag-transfer-min');
    this.$transferMax = this.$('.js-ag-transfer-max');
    this.$transferTimes = this.$('.js-ag-transfer-times');
    this.$transferCurrentMax = this.$('.js-ag-transfer-current-max');

    this.$ltAccount = this.$('.js-lt-account');
    this.$agAccount = this.$('.js-ag-account');

    this.$transAmount = this.$('.js-agTransfer-amount');
    this.transType = this.$('.js-ag-switchBtn');

    this.$submit = this.$('.js-ag-submitTransfer');

    self.loadUserBalance();
  },
  switchHandler: function(e) {
    var $target = $(e.currentTarget);
    var type = $target.data('switch');

    type = type === 1 ? 2 : 1;
    $target.data('switch', type);

    this.renderSwitch(type);
  },

  renderSwitch: function(type) {
    var minAmount = _(this.options.data.minAmount).convert2yuan();
    var transferMoney;

    if(type === 2) {
      this.$ltAccount.html('AG账户');
      this.$agAccount.html('彩票账户（主账户）');

      transferMoney = _(this.options.data.agTransferMoney).convert2yuan();

      this.$transferTimes.text(this.options.data.agTransferTimes);
      this.$transferCurrentMax.text(transferMoney);
    } else {

      this.$ltAccount.html('彩票账户（主账户）');
      this.$agAccount.html('AG账户');

      transferMoney = _(this.options.data.maxAmount).convert2yuan();

      this.$transferTimes.text(this.options.data.lotteryTransferTimes);
      this.$transferCurrentMax.text(transferMoney);
    }

    this.$transAmount.attr('data-parsley-range', '[' + minAmount + ', ' + transferMoney + ']');
  },

  loadUserBalance: function() {
    var self = this;

    this.getUserBalanceXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        var data = res.root || {};
        if(res && res.result === 0) {
          self.options.data = data;
          self.$lotteryBalance.text(_(data.lotteryBalance).fixedConvert2yuan());
          self.$agBalance.text(_(data.agBalance).fixedConvert2yuan());
          self.$agLimit.text(data.withdrawLimit);
          self.$transferMin.text(_(data.minAmount).convert2yuan());
          self.$transferMax.text(_(data.maxAmount).convert2yuan());

          self.renderSwitch(self.$switch.data('switch'));
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  submitTransferHandler: function(e) {
    var self = this;
    var $form = $(e.currentTarget);

    if (!$form.parsley().validate()) {
      return false;
    }

    this.$submit.button('loading');
    Global.sync.ajax({
      url: '/fund/transfer/agTransfer.json',
      data: {
        transferType: self.transType.data('switch'),
        tradeMoney: self.$transAmount.val()
      }
    }).always(function() {
      self.$submit.button('reset');
    })
      .done(function(res) {
        //var data = res.root || {};
        if(res && res.result === 0) {
          Global.ui.notification.show('转账成功');
          self.trigger('submit:complete');
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  }
});

module.exports = AgTransferView;
