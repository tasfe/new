define(function (require, exports, module) {

  var AddBlackCardView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-CardBlackList-Del.html'),

    events: {

    },

    initialize: function () {
    },
    onRender: function(){
      this.$('.js-fc-cbl-del-cardNo').html('您确定要把银行卡号：<strong>'+this.options.cardNo+'</strong>移出黑名单？');
      this.$('.js-fc-cbl-del-cardId').val(this.options.cardId);
    },

    insertNotice: function ( html) {
      this.$('.js-fc-arManage-notice').html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    }

  });

  module.exports = AddBlackCardView;
});