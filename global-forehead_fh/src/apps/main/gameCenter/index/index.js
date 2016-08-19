"use strict";

require('./index.scss');

var AgTransferView = require('./agTransform');

var GameCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-ag-bettingRecords': 'bettingRecordsHandler',
    'click .js-ag-transforMoney': 'transforMoneyHandler'
  },

  onRender: function() {
    var self = this;
  },

  bettingRecordsHandler:function () {
    alert('投注记录');
  },

  transforMoneyHandler:function () {
    
    this.$dialog = Global.ui.dialog.show({
      title: '转账',
      size: 'modal-lg',
      body: '<div class="js-ag-transfor-container"></div>',
      bodyClass: 'ag-transfor-dialog'
    });
    var $transferContainer = this.$dialog.find('.js-ag-transfor-container');
    var agt = new AgTransferView({el: $transferContainer}).render();
    this.$dialog.on('hidden.modal', function () {
      $(this).remove();
      agt.destroy();
    });
    
  }

});

module.exports = GameCenterView;
