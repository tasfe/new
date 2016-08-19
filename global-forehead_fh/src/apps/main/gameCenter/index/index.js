"use strict";

require('./index.scss');

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

    // this.$dialog.find('.js-acse-container').html(conetent.render().el);

    this.$dialog.on('hidden.modal', function () {
      $(this).remove();
    });
  }

});

module.exports = GameCenterView;
