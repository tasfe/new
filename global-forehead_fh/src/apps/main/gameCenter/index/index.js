"use strict";

require('./index.scss');

var AgTransferView = require('./agTransform');

var GameCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-ag-bettingRecords': 'bettingRecordsHandler',
    'click .js-ag-transforMoney': 'transforMoneyHandler',
    'click .js-ag-game-enter': 'enterAgHandler'
  },

  onRender: function() {
    var self = this;
    this.$agBalance = this.$('.js-transfer-balance');
    self.loadUserBalance();
  },
  loadUserBalance:function () {
    var self = this;
    Global.sync.ajax({
      url: '/acct/userinfo/getUserBalance.json'
    }).always(function(){
          self.loadingFinish();
        })
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            self.$agBalance.html(_(data.agBalance).fixedConvert2yuan());
          } else {
            Global.ui.notification.show('加载失败，请稍后再试');
          }
        })
        .fail(function () {
          Global.ui.notification.show('网络报错！');
        });
  },

  transforMoneyHandler:function () {
    
    this.$dialog = Global.ui.dialog.show({
      title: '转账',
      size: 'modal-lg',
      body: '<div class="js-ag-transfor-container"></div>',
      bodyClass: 'ag-transfor-dialog'
    });
    var $transferContainer = this.$dialog.find('.js-ag-transfor-container');
    var agt = new AgTransferView({el: $transferContainer,parentView: this}).render();
    this.$dialog.on('hidden.modal', function () {
      $(this).remove();
      agt.destroy();
    });
    
  },
  closeDialog: function() {
    this.$dialog.modal('hide');
  }

});

module.exports = GameCenterView;
