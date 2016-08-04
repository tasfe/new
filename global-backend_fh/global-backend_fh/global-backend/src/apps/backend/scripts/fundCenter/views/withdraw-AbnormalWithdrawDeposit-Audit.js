define(function (require, exports, module) {

  var AbnormalWithdrawAuditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/withdraw-AbnormalWithdrawDeposit-Audit.html'),

    events: {

    },

    initialize: function () {
    },

    onRender: function(){
      var type = this.options.type;
      var num = this.options.num;
      //绑定保存按钮的处理类型
      this.$('.js-fc-nwd-deal-submit').data('type',type);
      if(type==='allow'){
        this.$('.js-fc-nwd-deal-notice').removeClass('hidden');
        this.$('.js-fc-nwd-notDeal-notice').addClass('hidden');
        this.$('.js-fc-nwd-dealNum').html(num);

      }else if(type==='prevent'){
        this.$('.js-fc-nwd-deal-notice').addClass('hidden');
        this.$('.js-fc-nwd-notDeal-notice').removeClass('hidden');
        this.$('.js-fc-nwd-notDealNum').html(num);
      }
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

  module.exports = AbnormalWithdrawAuditView;
});