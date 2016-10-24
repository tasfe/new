"use strict";

require('./index.scss');

var AgTransferView = require('./agTransform');

var maintainImg = require('./maintain.png');

var GameCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-ag-bettingRecords': 'bettingRecordsHandler',
    'click .js-ag-transferMoney': 'transferMoneyHandler',
    'click .js-ag-game-enter': 'enterAgHandler'
  },

  onRender: function() {
    var self = this;
    this.$agGameEntry = this.$('.js-ag-game-entry');
    this.$agBalance = this.$('.js-transfer-balance');
    self.loadUserBalance();
    this.agLink = '/acct/login/doAglogin.json?token=' + Global.memoryCache.get('acctInfo').token;

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
          self.$agBalance.html(_(data.agBalance).fixedConvert2yuan());

          if (!data.open) {
            self.renderMaintain();
          }
          self.$agGameEntry.toggleClass('hidden', !data.open);
        } else {
          Global.ui.notification.show('加载失败，请稍后再试');
        }
      });
  },

  renderMaintain: function() {
    var $dialog = Global.ui.dialog.show({
      modalClass: 'modal-agMaintain',
      titleClose: true,
      body: '<dl class="ag-maintain clearfix">' +
      '<dt class="maintain-icon pull-left">' +
      '<img class="" src="' + maintainImg + '">' +
      '</dt>' +
      '<dd class="maintain-title">AG平台正在维护中...</dd>' +
      '<dd class="maintain-content">给您带来的不便，请谅解！</dd>' +
      '</dl>'
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });
  },

  transferMoneyHandler: function() {
    var self = this;
    if (Global.memoryCache.get('acctInfo').userGroupLevel !== 0) {
      var $dialog = Global.ui.dialog.show({
        title: '转账',
        size: 'modal-lg',
        body: '<div class="js-ag-transfer-container"></div>',
        bodyClass: 'no-padding'
      });
      var $transferContainer = $dialog.find('.js-ag-transfer-container');

      var agTransferView = new AgTransferView({
        el: $transferContainer
      }).render();

      $dialog.on('hidden.modal', function() {
        $(this).remove();
        agTransferView.destroy();
      });

      agTransferView.on('submit:complete', function() {
        Global.m.oauth.check();
        self.loadUserBalance();
        $dialog.modal('hide');
      });
    } else {
      Global.ui.notification.show('无转账权限，请联系在线客服。');
    }

  }
});

module.exports = GameCenterView;
